const User = require("../models/UserModel");
const { setUser } = require("../service/ServiceAuth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({ name, email, password });
  res.redirect("/login");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render("LoginPage", {
      error: "Invalid email or password"
    });
  }

  const token = setUser(user);
  res.cookie("token", token);
  res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };



/*

********************Explanation of this file********************

(1)
[
async function handleUserSignup(req , res) {
  const { name , email , password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}
]

✅ काय करतं?
-User ने Signup form भरून submit केलं.
-req.body मधून त्याचे name, email, password घेतले.
-User.create(...) ने हा user database मध्ये save केला.
-नंतर user ला / (homepage) वर redirect केलं.

(2)
[
async function handleUserLogin(req , res) {
  const { email , password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user)
    return res.render("LoginPage", {
      error: "Invalid Username or password",
    });

  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
}
]

✅ काय करतं?
-User ने login form भरलं आणि submit केलं.
-req.body मधून email आणि password घेतले.
-Database मध्ये तो email आणि password असलेला user शोधतो (User.findOne()).
-जर user सापडला नाही 👉 मग LoginPage पुन्हा render करतो आणि error message दाखवतो.
-जर user सापडला 👉 मग setUser(user) वापरून एक JWT token बनवतो.
-तो token browser मध्ये cookie म्हणून save करतो (res.cookie()).
-आणि शेवटी user ला / (homepage) वर redirect करतो.

🔸 const { v4: uuidv4 } = require("uuid");
✅ काय करतं?
-ही uuid नावाच्या library मधून v4 नावाचा function import करते.
-आणि त्याचं नवीन नाव ठेवते: uuidv4

🤔 पण uuid म्हणजे काय?
-uuid म्हणजे Universally Unique Identifier
-हे एक unique ओळख क्रमांक (ID) असतं — जे automatically तयार होतं.
-उदा.: f47ac10b-58cc-4372-a567-0e02b2c3d479

🔹 v4 काय करतं => uuid.v4() वापरून आपण random UUID generate करू शकतो

*/


/*
       const token = setUser(user);
       res.cookie("token" , token);

-The function setUser(user) is creating something like a "pass" or "ID card" for the user.
 This "pass" (called a token) holds information about the user (like who they are).
-It generates a token based on the user’s data so that the system knows the user has 
logged in and is allowed to access certain features or pages.

-res.cookie("token", token); => This line places that "pass" (the token) in the user's 
browser as a cookie.
-The cookie is like a small piece of information stored in the browser. 
 Each time the user interacts with your website after logging in, the browser 
 automatically sends this "pass" (token) to the server.
-With this token, the server can recognize that the user is already logged in and let 
them access protected pages.

**Why do we need this?
-After logging in, the server needs a way to remember that the user is logged in, even 
when they visit different pages on your site. 
-The token (stored in the cookie) does this job. It’s like a backstage pass that lets 
 the user move around the site without needing to log in again.

*/
