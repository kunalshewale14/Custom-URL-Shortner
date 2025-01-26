const { getUser } = require("../service/Tut18Auth");


// this functions represents Authentication
function checkForAuthentication(req , res , next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;
  
  if(!tokenCookie) return next();
  
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
}


// this functions represents Authorization
function restrictTo(roles) {
  return function (req , res , next){
     if(!req.user) return res.redirect("./login");

     if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

     return next();
  };
}

module.exports = {
  checkForAuthentication,
  restrictTo,
};