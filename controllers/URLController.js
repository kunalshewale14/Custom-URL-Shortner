const shortid = require("shortid");
const URL = require("../models/URLmodel");

async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  const shortId = shortid.generate();

  await URL.create({
    shortId,
    redirectURL: url,
    visitHistory: [],
    createdBy: req.user._id
  });

  const urls = await URL.find({ createdBy: req.user._id });

  res.render("HomePage", {
    id: shortId,
    urls,
    user: req.user
  });
}

async function handleGetAnalytics(req, res) {
  const result = await URL.findOne({ shortId: req.params.shortId });
  res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory
  });
}

module.exports = { handleGenerateNewShortURL, handleGetAnalytics };


/*

🔷 handleGenerateNewShortURL(req, res)

➡️ हे काय करतो?
👉 user ने दिलेलं मोठं URL घेतं
👉 त्याचं छोटं short ID तयार करतं (उदा. aB12Cd)
👉 ते सगळं database मध्ये store करतं
👉 आणि मग HomePage दाखवतं, ज्यात तो short ID दिसतो

📖 काय स्टेप्स आहेत?
-user कडून आलेली URL घेतो (req.body.url)
-जर URL दिलं नसेल तर “URL is required” असा error पाठवतो
-shortid.generate() ने एक छोटा ID तयार करतो
-हे सगळं database मध्ये टाकतो (URL.create(...))
-HomePage दाखवतो आणि short ID दाखवतो

🔹 handleGetAnalytics(req, res)
**काय करतो:
-दिलेल्या shortId साठी analytics (म्हणजे किती वेळा click झाला) मिळवतो.

स्टेप्स:
-req.params.shortId मधून short ID घेतो (URL मधून येतो).
-Database मधून तो shortId शोधतो.
-तो shortId किती वेळा visit झाला हे visitHistory.length वापरून काढतो.
-JSON मध्ये response पाठवतो:
{
  "totalClicks": 5,
  "analytics": [ {...}, {...} ]  // visit history data
}


*/