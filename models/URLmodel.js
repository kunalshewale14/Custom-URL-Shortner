const mongoose = require("mongoose");

// Schema
const urlSchema = new mongoose.Schema({

    shortId : {
        type : String,
        required : true,
        unique : true,
    },

    redirectURL : {
        type : String,
        required : true,
    },
     
    visitHistory: [{ timestamp : { type : Number } }],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users",
    },

  } , 

  { timestamps : true }
  
);

//model
const URL = mongoose.model("url",urlSchema);

module.exports = URL;



/*

🔹 1) visitHistory: [{ timestamp: { type: Number } }],
👉 याचा अर्थ:
-ही एक array आहे ([]) ज्यामध्ये अनेक visit details ठेवले जातात.
प्रत्येक visit मध्ये एकच field आहे: timestamp.

✅ सोपं करून सांगायचं तर:
-आपण जेव्हा short URL वापरतो (/shortner/:shortId) तेव्हा timestamp साठवतो.
म्हणजे user कधी URL visit केलं, ही माहिती timestamp म्हणून save होते.

🧠 उदाहरण:
visitHistory: [
  { timestamp: 1718709381 },
  { timestamp: 1718710042 }
]

🔹 2) createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
👉 याचा अर्थ:
-createdBy या field मध्ये त्या user चा ID save होतो, ज्याने URL बनवले.
-हा ObjectId type चा आहे — म्हणजे MongoDB मधील user चा _id.

🔁 ref: "users" म्हणजे:
-हा field users collection मधल्या data शी जोडलेला आहे.
म्हणजे जर हवे असेल तर .populate("createdBy") वापरून आपण त्या user चं पूर्ण माहिती घेऊ शकतो.

📌 एकत्रित उदाहरण:

{
  "shortId": "Xyz123",
  "redirectURL": "https://google.com",
  "visitHistory": [
    { "timestamp": 1718709381 }
  ],
  "createdBy": "665c3dbcc94a78e3d2bc5e79" // म्हणजे user चा ObjectId
}

🧠 वापर का?
-visitHistory → किती वेळा आणि कधी URL visit झाला हे track करण्यासाठी.
-createdBy → हे URL कोणत्या user ने तयार केलं हे सांगण्यासाठी.


*/