const express = require("express");
const URL = require("../models/Tut18model"); // Ensure correct import path
const { restrictTo } = require("../middlewares/Tut18Auth");


const router = express.Router();

router.get("/admin/urls", restrictTo(["ADMIN"]) , async(req , res) => {
  const allurls = await URL.find({});
  return res.render("Tut18Home" , {
    urls : allurls,
  });
});

router.get("/", restrictTo(["NORMAL" , "ADMIN"]) , async(req , res) =>{
    const allurls = await URL.find({ createdBy: req.user._id });
    return res.render("Tut18Home" , {
        urls : allurls,
    });
})

router.get("/signup" , (req , res) => {
   return res.render("Tu18Signup");
});

router.get("/login" , (req , res) => {
    return res.render("Tut18Login");
 });

module.exports = router;