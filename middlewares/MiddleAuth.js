const { getUser } = require("../service/ServiceAuth");

function checkForAuthentication(req, res, next) {
  const token = req.cookies?.token;
  req.user = token ? getUser(token) : null;
  next();
}

function restrictTo(roles) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req.user.role))
      return res.render("UnAuthorized");
    next();
  };
}

module.exports = { checkForAuthentication, restrictTo };



/*

*********************Explanation of this file*********************

*** checkForAuthentication

function checkForAuthentication(req, res, next) {
🔹 checkForAuthentication ही function middleware म्हणून वापरली जाते.
ती तीन arguments घेते: req (request), res (response) आणि next
(पुढच्या middleware / route handler कडे control देण्यासाठी).

const token = req.cookies?.token;
🔹 req.cookies मधून JWT token काढला जातो.
🔍 optional chaining (?.) वापरल्यामुळे req.cookies undefined असला तरी error येत नाही.
✔️ cookie मध्ये "token" असल्यास तो token variable मध्ये येतो, नसल्यास undefined येतो.

req.user = token ? getUser(token) : null;
🔹 जर token available असेल तर getUser(token) call केली जाते.
✔️ token valid असेल → user object (जसं _id, email, role) मिळतो.
❌ token invalid किंवा absent असेल → req.user = null सेट केला जातो.
👉 म्हणजे authenticated user असेल तर req.user मध्ये data मिळतो, नाहीतर null राहतो.

next();
🔹 शेवटी next() call करून पुढच्या middleware किंवा route handler कडे control दिला जातो.
👉 ही middleware request block करत नाही; फक्त user information attach करते.

**** Optional chaining (?.)
🔹 हे JavaScript मधील safe syntax आहे.
✔️ undefined / null value असल्यास error न देता property access करायला मदत करते,
यामुळे application crash होत नाही.

🔚 सारांश (checkForAuthentication):
- Client कडून आलेल्या cookies मधून JWT token घेतो.
- Token असल्यास तो verify करून user माहिती काढतो (getUser वापरून).
- req.user मध्ये user info किंवा null set करतो.
- Request पुढे process होण्यासाठी next() call करतो.


**** restrictTo

function restrictTo(roles) {
🔹 ही function एक parameter घेते – roles (array).
उदा. ["ADMIN"] किंवा ["NORMAL", "ADMIN"]
👉 म्हणजे या roles असलेल्या users ना access दिला जाईल.

return function (req, res, next) {
🔹 ही actual middleware function आहे जी specific routes वर लावली जाते.
ती req, res, next arguments घेते.

Step 1: User authenticated आहे का ते तपासा
     if (!req.user) return res.redirect("/login");
🔸 जर req.user null असेल (म्हणजे user login नाही),
तर user ला login page वर redirect केले जाते.

Step 2: User ची role तपासा
     if (!roles.includes(req.user.role)) return res.render("UnAuthorized");
🔸 जर user ची role दिलेल्या roles array मध्ये नसेल,
तर "UnAuthorized" page render केला जातो.
🛑 म्हणजे user ला त्या route चा access नाही.

Step 3: सर्व काही योग्य असेल तर पुढे जा
     next();
🔸 जर user authenticated असेल आणि role पण योग्य असेल,
तर next() call करून पुढच्या middleware किंवा route handler कडे request पाठवली जाते.

📌 सारांश (restrictTo):
| Step | Description                                              |
| ---- | -------------------------------------------------------- |
| 1    | user login आहे का ते तपासतो                               |
| 2    | user ची role allowed आहे का ते तपासतो                     |
| 3    | दोन्ही योग्य असतील तर route ला access देतो (`next()`)     |
| 4    | अन्यथा user ला login किंवा Unauthorized page दाखवतो      |

*/



/*

*********************Explanation of this file*********************

***checkForAuthentication 

function checkForAuthentication(req , res , next) {
🔹 checkForAuthentication ही function आहे जी middleware म्हणून वापरली जाते.
ती तीन arguments घेते: req (request), res (response), आणि next (पुढच्या middleware/function 
ला control देण्यासाठी).

const tokenCookie = req.cookies?.token;
🔹 req.cookies मधून JWT token काढतो, जर आहे तर.
🔍 ?. वापरले आहे म्हणजे optional chaining — जर req.cookies undefined असेल, तरी error येणार नाही.
✔️ जर cookie मध्ये token नावाचं काही असेल, तर ते tokenCookie मध्ये येईल.

req.user = null;
🔹 सुरुवातीला req.user ला null सेट करतो.
✅ म्हणजे: अजून user verify नाही केला.

if(!tokenCookie) return next();
🔹 जर cookie मध्ये token मिळालाच नाही, तर पुढच्या middleware कडे (next()) control देतो.
👉 म्हणजेच: unauthenticated user आहे, पण error टाकत नाही.

const token = tokenCookie;
🔹 tokenCookie वरून token variable बनवतो (optional step — clarity साठी).

const user = getUser(token);
🔹 या token वरून getUser() function call करतो (तुम्ही आधी define केलेली function).
✅ जर token valid असेल, तर user मध्ये _id, email, role असं user info येईल.
❌ जर token invalid असेल, तर null येईल.

req.user = user;
🔹 req.user मध्ये तो user object टाकतो.
✅ पुढच्या routes मध्ये req.user वापरून तुम्ही user कोण आहे ते ओळखू शकता

return next();
🔹 शेवटी, पुढच्या middleware किंवा route handler ला control देतो.

****Optional chaining (?.) हे JavaScript मधलं एक powerful आणि सोपं syntax आहे, 
जे undefined किंवा null values असल्यास error येऊ न देता सुरक्षितपणे access करायला मदत करतं.
✅ त्यामुळे तुमचं code crash न होता safe राहतो.

🔚 सारांश:
-ही function काय करते?
-Client कडून आलेल्या cookie मधून JWT token काढते.
-तो token verify करते (getUser() वापरून)
-जर token valid असेल तर req.user मध्ये user info टाकते.
-शेवटी, पुढच्या middleware/route handler ला पाठवते (next()).


****restrictTo
function restrictTo(roles) {
🔹 ही function एक parameter घेते – roles
उदा. ["ADMIN"] किंवा ["NORMAL", "ADMIN"]
=> म्हणजे access फक्त या roles साठीच असेल.

return function (req, res, next) {
🔹 ही actual middleware function आहे. ती पुढच्या route ला लावली जाते.
-ती req, res, next घेते.

Step 1: User authenticated आहे का ते बघा
     if (!req.user) return res.redirect("./login");
🔸 जर req.user नाही (म्हणजे user login नाही), तर त्याला login page वर redirect करा.

Step 2: Role check करा 
     if (!roles.includes(req.user.role)) return res.render("UnAuthorized");
🔸 जर user ची role, दिलेल्या roles मध्ये नाही (उदा. ["ADMIN"] मध्ये NORMAL येत नसेल), तर UnAuthorized page render करा.
🛑 म्हणजे तो user त्या route ला access करू शकत नाही.

Step 3: Role योग्य असेल तर पुढे जा
     return next();
🔸 जर user exists आणि त्याची role पण योग्य असेल, तर next() call करून पुढच्या middleware/route ला पाठवा.

📌 सारांश:
| Step | Description                                              |
| ---- | -------------------------------------------------------- |
| 1    | user login आहे का ते बघतो                                 |
| 2    | user ची role योग्य आहे का ते तपासतो                         |
| 3    | जर दोन्ही ठीक असेल तर पुढे route ला नेतो (`next()`)           |
| 4    | अन्यथा user ला `login` किंवा `Unauthorized` page वर नेतो     |



*/