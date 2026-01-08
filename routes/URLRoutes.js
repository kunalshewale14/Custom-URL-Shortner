const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics
} = require("../controllers/URLController");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;

/*

🔷 router.post("/", handleGenerateNewShortURL);
➡️ कधी वापरतो?
-जेव्हा user form भरून URL submit करतो
-उदा. मोठं URL द्यायचं आणि त्याचं छोटं link तयार करायचं

➡️ काय करतं?
-form मधून आलेलं मोठं URL घेतं
-short ID तयार करतं
-database मध्ये save करतं
-आणि HomePage render करतं

🔷 router.get("/analytics/:shortId", handleGetAnalytics);
➡️ कधी वापरतो?
-user जर एखाद्या short URL चं report (analytics) बघू इच्छित असेल
-उदा. किती वेळा क्लिक झालं, कोणत्या वेळी झालं वगैरे

➡️ काय करतं?
-database मधून तो shortId शोधतं
-त्याची visitHistory काढतं
-आणि किती clicks झाले ते JSON मध्ये पाठवतं

*/
