const express = require("express");
const {
  handleUserSignup,
  handleUserLogin
} = require("../controllers/UserController");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;


/*

🔸router.post("/", handleUserSignup);
👉 याचा अर्थ:
-जेव्हा user आपल्या वेबसाइटवर Signup form submit करतो (POST /),
-तेव्हा ही request handleUserSignup ह्या function कडे जाते.
-मग तो function user चं नाव, ईमेल, पासवर्ड वाचतो आणि database मध्ये नवीन user तयार करतो.

✅ उद्दिष्ट => नवीन user create करणं (Signup)

🔸 router.post("/login", handleUserLogin);
👉 याचा अर्थ:
-जेव्हा user आपला Login form submit करतो (POST /login),
-तेव्हा ती request handleUserLogin ह्या function कडे जाते.
-मग तो function user चं ईमेल आणि पासवर्ड तपासतो.
-जर बरोबर असेल तर JWT token तयार करतो आणि browser मध्ये cookie म्हणून ठेवतो.

✅ उद्दिष्ट => User ला login करून त्याचं session सुरू करणं



*/