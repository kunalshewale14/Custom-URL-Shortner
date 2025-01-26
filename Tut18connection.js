const mongoose = require("mongoose");
mongoose.set("strictQuery",true);
async function connetToMongoDB(url) {
    return mongoose.connect(url);
}

module.exports = {
    connetToMongoDB,
}