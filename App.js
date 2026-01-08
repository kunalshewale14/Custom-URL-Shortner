const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connection");
const { checkForAuthentication, restrictTo } = require("./middlewares/MiddleAuth");

const app = express();
const PORT = 8001;

// Routes
const urlRoute = require("./routes/URLRoutes");
const staticRoute = require("./routes/StaticRouter");
const userRoute = require("./routes/UserRoutes");

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Database
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log("MongoDB Connected"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

// Routes
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);




/*
  Authentication => 
    What it is: The process of verifying who someone is.
    Example: When you log in to a website by entering your username and password, 
             the system checks if you are a registered user with the right credentials.

  Authorization => 
    What it is: The process of determining what actions or resources a user 
                 is allowed to access after they are authenticated.
    Example: Once you're logged in, the system checks if you have permission to view 
            certain pages, perform specific actions (like admin tasks), or access certain data.
*/





/*

****************************Explanation of this file****************************

  (1)cookie-parser => cookie-parser is a middleware that helps parse cookies attached to client requests.
                      It makes the cookies accessible through req.cookies.
    -It's often used in applications where you need to read or manage cookies 
    (e.g., for sessions, user authentication).
   
  🔍 काय करतो?
  -cookie-parser हा middleware आहे जो incoming request मधून cookies read करतो.
  -त्यामुळे तुम्ही request मधून cookies वाचू शकता — उदाहरणार्थ, JWT token, session ID वगैरे.

 🧠 उदाहरण : // जर user ने cookie पाठवली असेल — { token: 'abc123' }
              console.log(req.cookies.token); // 'abc123'

    
  (2)path => It's useful for handling and transforming file paths in a cross-platform manner
             (i.e., ensuring compatibility between Windows and Unix-based systems).

  (3)app.set('view engine', 'ejs');
  **What it does : 
  -This tells Express to use EJS as the view engine.
  -It means that when you call res.render('somePage'), Express will look for a file 
  named somePage.ejs and use the EJS templating engine to render it.
  
  **Why it's needed => So you can write HTML pages with dynamic data using EJS 
  syntax (e.g., <%= user.name %>).

  (4)app.set("views", path.resolve("./views"));
  **What it does :
  -This tells Express where to find your EJS templates (i.e., your .ejs files).
  -path.resolve("./views") means: "look for a folder named views in the root directory
  of the project".
  
  **Why it's needed => By default, Express looks for views in a folder called /views, 
  but this makes it explicit and allows you to customize the location if needed.

  (5)app.use(express.static(path.join(__dirname, 'public')));
  🔁 थोडक्यात उत्तर => जर तुझ्या .ejs files मध्ये CSS किंवा JS files ला <link> किंवा <script> ने 
    लिंक केलं असेल, तर :  ही line आवश्यक आहे => app.use(express.static(path.join(__dirname, 'public')));
  🔹 आणि एक public folder सुद्धा असायलाच हवा, त्यात त्या फाइल्स असतील.

📁 उदाहरण:
project/
├── views/
│   └── home.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── app.js

***In home.ejs:
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <script src="/js/script.js"></script>
</body>
</html>

***In app.js => app.use(express.static(path.join(__dirname, 'public')));

✅ जर तुझ्या .ejs files मध्ये CSS/JS फाइल्स link केलेल्या नाहीत, म्हणजेच:
<!-- asa kahi nahi -->
<link rel="stylesheet" href="/css/style.css">
<script src="/js/script.js"></script>
तर:
🔹 public folder लागत नाही
🔹 ही line सुद्धा नको => app.use(express.static(path.join(__dirname, 'public')));

****Conclusion => But ya project madhe me css internal lihal ye files chya links 
deun nhi so ya project madhe me he line nhi lihali tri chalel.

  (6)app.use(checkForAuthentication);
  🔍काय करतो?
   -checkForAuthentication हे तुमचं custom middleware आहे.
   -याचा उपयोग करून तुम्ही बघू शकता की user login आहे का (authentication तपासण्यासाठी).

  (7)app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
  🔍 या line चा अर्थ:
   -जेव्हा user /url या path वर request करेल, तेव्हा:
   -पहिलं restrictTo(["NORMAL", "ADMIN"]) हे middleware चालेल
   -जर user ला role परवानगी असेल (NORMAL किंवा ADMIN), तरच
   -urlRoute या route handler कडे control जाईल

  🔁 घटकांबद्दल तपशीलाने:
  ✅ 1. /url
  -याचा अर्थ: ही route prefix आहे.
म्हणजे /url/... अशा सगळ्या routes साठी हा middleware आणि route handler लागू होईल.

  ✅ 2. restrictTo(["NORMAL", "ADMIN"])
  -हे एक custom middleware आहे.
  -यातून role-based access control लागू केला जातो.
म्हणजे फक्त NORMAL किंवा ADMIN role असलेल्या users ना /url access करण्याची परवानगी दिली जाते.
  
*/