const shortid = require("shortid");
const URL = require("../models/Tut18model");

async function handleGenerateNewShortURL(req , res){
    console.log(req.body);
    const body = req.body;
    if(!body.url) return res.status(400).json({ error : "url is required..!"});

    const shortId = shortid.generate();

    try 
    {
        await URL.create({
            shortId, // Pass the generated shortId here
            redirectURL: body.url,
            visitHistory: [],
            createdBy : req.user._id,
        });

        return res.render("Tut18Home" , {
            id : shortId
        });
    } 
    catch (error) 
    {
        console.error("Error creating URL:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

async function handleGetAnalytics(req , res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json( { 
        totalClicks : result.visitHistory.length , 
        analytics : result.visitHistory , 
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics,
};