const jwt = require("jsonwebtoken");
const secret = "Kunal$123@$";

function setUser(user) {
   return jwt.sign({
    _id : user._id,
    email : user.email,
    role : user.role,
    } , 
   secret
  );
}

function getUser(token){
   if(!token) return null;
   try {
      return jwt.verify(token , secret);
   } catch (error){
     return null;  
   }
}

module.exports = {
    setUser,
    getUser,
}



/*

******************Explanation of this file******************

✅ const jwt = require("jsonwebtoken");
-यात आपण jsonwebtoken नावाचं npm package import करतो.
-हे package JWT तयार करणं आणि verify करणं सोपं करतं.

✅ const secret = "Kunal$123@$";
-ही secret key आहे.
-Token बनवताना आणि verify करताना ही key वापरली जाते.
-हिच्या आधारे system token secure ठेवतो आणि verify करतो की तो चुकीचा तर नाही.

🧠 आता उदाहरण पाहू:
🔐 Token तयार करणे : const token = jwt.sign({ userId: 123 }, secret);
   -userId: 123 असा data टाकून, तो secret key वापरून encrypt होतो.

✅ Token verify करणे : const data = jwt.verify(token, secret);
   -यामध्ये secret key योग्य असेल तरच token verify होतो.

🔐 Secret Key कशासाठी लागते?

| काम          | Role                                |
| ------------ | ----------------------------------- |
| Token create | secret वापरून encrypt केलं जातं        |
| Token verify | तोच secret वापरून decrypt केलं जातं    |

🔚 निष्कर्ष:
-jsonwebtoken हे JWT बनवण्यासाठी वापरतो,
-आणि secret ही key त्यात encryption/verification साठी अत्यंत महत्वाची असते

---------
[
function setUser(user) {
   return jwt.sign({
    _id : user._id,
    email : user.email,
    role : user.role,
    } , 
   secret
  );
}
]

🔹 function setUser(user) {
👉 ही एक function declaration आहे — setUser नावाची function आहे जी user नावाचं एक argument 
   घेत आहे.

user मध्ये User चं संपूर्ण डेटा (ID, Email, Role) असतो.

🔹 return jwt.sign({
👉 jwt.sign() ही function वापरून एक JWT Token तयार केलं जातं.

हे Token म्हणजे एका user ची ओळख दर्शवणारा secure string असतो.

🔹 _id: user._id,
👉 Token मध्ये आपण user चं MongoDB ID (user._id) ठेवतो.

हे server ला सांगतं की user कोण आहे.

🔹 email: user.email,
👉 User चं email address सुद्धा token मध्ये ठेवतो.

काही वेळा server ला email ची गरज असते — म्हणून तो सुद्धा टाकतो.

🔹 role: user.role,
👉 User चा role पण token मध्ये ठेवतो (उदाहरणार्थ: "NORMAL" किंवा "ADMIN").

याचा उपयोग authorization साठी होतो — म्हणजे कोणत्या user ला काय परवानगी आहे हे ठरवायला.

🔹 }, secret);
👉 jwt.sign() ला दुसरा argument म्हणून secret दिला आहे —
हा secret म्हणजे एक गुप्त कळ (key) आहे ज्याचा वापर token encrypt करण्यासाठी होतो.

➡️ secret मुळे token secure होतं. Server कडेच हाच secret असतो आणि तो वापरून तो token 
   verify करतो.

✅या function मुळे user चं data घेऊन त्याचं एक secure token तयार केलं जातं,
जे login झाल्यावर browser ला cookie मधून दिलं जातं.

------
[
function getUser(token){
   if(!token) return null;
   try {
      return jwt.verify(token , secret);
   } catch (error){
     return null;  
   }
}
]

🔹 function getUser(token) {
👉 getUser ही function आहे, जी token नावाचं एक argument घेते.
-token म्हणजे JWT token — user login झाल्यावर browser मध्ये जे cookie मध्ये store झालेलं असतं.

🔹 if (!token) return null;
👉 जर token नसेल (म्हणजे undefined किंवा खाली काहीच नसेल)
तर लगेच null return करतो.

🔁 कारण: token नसल्यास आपण user ओळखू शकत नाही.

🔹 try { return jwt.verify(token, secret); }
👉 jwt.verify(token, secret) हे function वापरून token verify (check) करतो की तो valid 
आहे का.

जर token योग्य असेल, आणि secret key बरोबर encrypt केलेलं असेल,
तर हे function त्या token मधून user चं data (ID, email, role) काढून परत करतं.

✅ म्हणजेच: हे verified user चं object परत करतं:
{
  _id: "...",
  email: "...",
  role: "ADMIN"
}

🔹 catch (error) { return null; }
👉 जर jwt.verify() करताना काही error आली (उदा. token expired झाला, खराब आहे, बदललेला आहे),
तर function null return करते.

🔁 कारण: चुकीचं token वापरून user ला login समजणं चुकीचं ठरेल.


*/