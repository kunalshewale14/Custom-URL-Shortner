const express = require("express");
const URL = require("../models/URLmodel");
const { restrictTo } = require("../middlewares/MiddleAuth");

const router = express.Router();

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const urls = await URL.find({ createdBy: req.user._id });
  res.render("HomePage", { urls, user: req.user });
});

router.get("/admin/urls", restrictTo(["ADMIN"]), async (req, res) => {
  const urls = await URL.find({});
  res.render("HomePage", { urls, user: req.user });
});

router.get("/signup", (req, res) => res.render("SignupPage"));
router.get("/login", (req, res) => res.render("LoginPage"));

router.get("/shortner/:shortId", async (req, res) => {
  const entry = await URL.findOneAndUpdate(
    { shortId: req.params.shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  res.redirect(entry.redirectURL);
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;

/*

*********************Explanation of this File*********************

(1)const router = express.Router();
🔍 ही line काय करते => ही line एक Router object तयार करते.
-Router object म्हणजे एक छोटं express app — ज्यात routes define करू शकतो 
(router.get(), router.post() वगैरे), आणि नंतर ते एका main app (app.js) मध्ये 
app.use() ने attach करता येतं.

(2)
[ 
    router.get("/admin/urls", restrictTo(["ADMIN"]) , async(req , res) => {
      const allurls = await URL.find({});
      return res.render("HomePage" , {
        urls : allurls,
      });
    });             
]

✅ Explanation (Simple Marathi):

🔹 router.get("/admin/urls", ...)
या route वर user GET request पाठवतो जेव्हा तो /admin/urls या URL ला visit करतो.

🔹 restrictTo(["ADMIN"])
हे middleware MiddleAuth.js मध्ये लिहिलं असेल — हे पाहतं की user चा role म्हणजे ADMIN आहे का.
जर नसेल, तर तो access करू शकणार नाही (forbidden error).

🔹 await URL.find({})
MongoDB मधून सर्व short URLs fetch केली जातात. jar user admin asel tr

🔹 res.render("HomePage", { urls: allurls })
HomePage.ejs ही view template वापरून browser मध्ये सगळी URL ची list दाखवली जाते.

✅ Usage:
जर logged-in user ADMIN role चा असेल, तर /admin/urls वर गेल्यावर त्याला सर्व users चे URLs दिसतील.
NORMAL user ला ही route accessible नसेल.


(3)
[
    router.get("/", restrictTo(["NORMAL" , "ADMIN"]) , async(req , res) =>{
      const allurls = await URL.find({ createdBy: req.user._id });
      return res.render("HomePage" , {
        urls : allurls,
      });
    })
]

🔹 router.get("/")
म्हणजेच user / URL ला visit करतो (main dashboard/homepage route).

🔹 restrictTo(["NORMAL", "ADMIN"])
हे middleware बघतं की user चा role NORMAL किंवा ADMIN आहे का.
दोघांनाही या route ला access करण्याची परवानगी आहे.

🔹 await URL.find({ createdBy: req.user._id })
MongoDB मधून फक्त तोच user ज्याने URL तयार केले आहेत — त्याचेच URLs शोधले जातात.

req.user._id हे authentication middleware (checkForAuthentication) मुळे available असतं.

म्हणजे logged-in user कोण आहे हे ओळखून त्याचेच data filter होतात.

🔹 res.render("HomePage", { urls })
HomePage.ejs ही view template वापरून browser मध्ये URLs ची यादी (table/list) दाखवली जाते.

📌 उदाहरण Flow:
-Suppose user Ram login होतो.
-तो / या URL ला visit करतो.
-System त्याचे create केलेले URLs (createdBy: Ram._id) database मधून घेते.
-आणि HomePage.ejs मधून तो list पाहतो.

🔐 आणि ADMIN ला का access दिलं?
कदाचित ADMIN ला आपला personal dashboard सुद्धा पाहायचा असेल, म्हणून दोघांनाही परवानगी आहे.

| Component                               | Purpose                                       |
| --------------------------------------- | --------------------------------------------- |
| `/` route                               | Homepage/dashboard                            |
| `restrictTo(["NORMAL", "ADMIN"])`       | फक्त authenticated users साठी access          |
| `URL.find({ createdBy: req.user._id })` | फक्त त्या user ने तयार केलेले URLs            |
| `res.render("HomePage", { urls })`      | EJS file render होते आणि URL list दाखवली जाते |

(4)
[
    router.get("/signup", (req, res) => {
      return res.render("SignupPage");
    });

    router.get("/login", (req, res) => {
      return res.render("LoginPage");
    });

]

🔹 router.get("/signup", ...):
-जेव्हा user browser मध्ये /signup URL वर जातो,
-तेव्हा SignupPage.ejs नावाचं EJS file render केलं जातं (HTML page दाखवतो).
-या page वर user आपलं नाव, ईमेल, पासवर्ड वगैरे भरून नोंदणी (sign up) करू शकतो.

🔹 router.get("/login", ...):
-जेव्हा user /login URL ला visit करतो,
-तेव्हा LoginPage.ejs नावाचं login form असलेलं page render केलं जातं.
-user login form मध्ये email व password टाकून system मध्ये प्रवेश करू शकतो.

(5)
[
router.get("/shortner/:shortId", async(req , res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
          shortId 
        } , 
        { 
            $push : {
              visitHistory : {
              timestamps : Date.now(),
               },
            },
        }
  );
  res.redirect(entry.redirectURL);
});
]

🔹 हे काय करतो?
-ही "/shortner/:shortId" ही एक route आहे जी short URL वापरून long URL वर redirect करते.

🌐 उदाहरण:
-तुझ्याकडे एक short URL आहे:
👉 http://localhost:8001/shortner/abc123
म्हणजे abc123 हे एक छोटंसं code आहे जे Google चं full URL दाखवतं.

📌 काय घडतं step-by-step?
-user ब्राउझर मध्ये abc123 असा short URL टाकतो.
-आपला server abc123 database मध्ये शोधतो.
-तो entry सापडल्यावर त्याच्यात visitHistory (म्हणजे किती वेळा बघितलं गेलं आणि कधी) हे extra update करतं.
-मग user ला त्या URL वर redirect (म्हणजे पुढे पाठवतो) करतो — जसं https://www.google.com.

🧠 सरळ अर्थ:
-short URL वर क्लिक केलं की long URL ला visit करतो.
-आणि त्या visit चा रेकॉर्ड ठेवतो (कधी पाहिलं ते timestamp मध्ये).

✅ उदाहरण:
shortId	redirectURL
abc123	https://www.google.com

जर तू localhost:8001/shortner/abc123 वापरलं तर:
➡ तुला https://www.google.com वर पाठवलं जाईल
➕ आणि timestamp सेव्ह होईल — म्हणजे ही visit झाली हे लक्षात ठेवेल.

(6)
[
  router.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/login');
  });
]

✅ याचा अर्थ अगदी साध्या भाषेत:
-User logout करतो (उदाहरणार्थ, "Logout" बटणावर क्लिक केलं).
-या वेळी /logout या route ला request जाते.
-res.clearCookie('token') → या line मुळे user च्या browser मधून "token" नावाची cookie delete होते.
-ही cookie म्हणजेच login केल्यावर server ने दिलेली user ची ओळख (authentication).
-नंतर user ला /login page वर परत पाठवलं जातं (redirect).

(7)module.exports = router;


*/