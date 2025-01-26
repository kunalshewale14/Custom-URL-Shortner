const express = require("express");
const {
     handleGenerateNewShortURL ,
      handleGetAnalytics
    } = require("../controllers/Tut18controller");

const router = express.Router();
router.post("/" , handleGenerateNewShortURL);
router.get("/analytics/:shortId" , handleGetAnalytics);
module.exports = router;