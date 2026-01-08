const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

async function connectToMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = { connectToMongoDB };





/*

🔹mongoose.set("strictQuery", true); 
****याचा साध्या भाषेत अर्थ : हे सांगतो की => "Query करताना फक्त त्या fields वरच काम कर, 
जे schema मध्ये define केले आहेत."

🧠 उदाहरणाने समजावू :
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

--जर strictQuery: true असेल आणि तू खालील query केली:
User.find({ city: "Pune" });
-तर city हा field schema मध्ये नाही.
त्यामुळे Mongoose त्या query कडे दुर्लक्ष करतो.
-Query चालते, पण city वापरण्यात येत नाही.

*/