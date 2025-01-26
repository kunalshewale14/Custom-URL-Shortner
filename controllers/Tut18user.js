const {v4 : uuidv4} = require("uuid");
const User = require("../models/Tut18user");
const { setUser } = require("../service/Tut18Auth");

async function handleUserSignup(req , res) {
  const { name , email , password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}

async function handleUserLogin(req , res) {
  const { email , password } = req.body;
  const user = await User.findOne( {email , password} );
  if(!user)
    return res.render("Tut18Login" , {
      error : "Invalid Username or password",   
    });

    
    const token = setUser(user);
    res.cookie("token" , token);
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
};



/*
       const token = setUser(user);
       res.cookie("token" , token);

-The function setUser(user) is creating something like a "pass" or "ID card" for the user. This "pass" (called a token) holds information about the user (like who they are).
It generates a token based on the user’s data so that the system knows the user has logged in and is allowed to access certain features or pages.
res.cookie("token", token);:

-This line places that "pass" (the token) in the user's browser as a cookie.
-The cookie is like a small piece of information stored in the browser. 
 Each time the user interacts with your website after logging in, the browser automatically sends this "pass" (token) to the server.
-With this token, the server can recognize that the user is already logged in and let them access protected pages.
-Why do we need this?
-After logging in, the server needs a way to remember that the user is logged in, even when they visit different pages on your site. 
 The token (stored in the cookie) does this job. It’s like a backstage pass that lets the user move around the site without needing to log in again.                                    
*/
