// Authorization (Tut18 is the successfully working project)

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connetToMongoDB } = require("./Tut18connection");
const { checkForAuthentication ,  restrictTo } = require("./middlewares/Tut18Auth");
const URL = require("./models/Tut18model");


const app = express();
const PORT = 8001;


//Routes
const urlRoute = require("./routes/Tut18Routes");
const Tut18StaticRoute = require("./routes/Tut18StaticRouter");
const userRoute = require("./routes/Tut18user")


// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set("views" , path.resolve("./views"));


//connection
connetToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(() => console.log("Mongodb connected..!"));


//mmiddlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url"  , restrictTo(["NORMAL" , "ADMIN"]) ,  urlRoute);
app.use("/user" , userRoute);
app.use("/"  ,Tut18StaticRoute);


app.get("/shortner/:shortId", async(req , res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
          shortId 
        } , 
        { 
            $push : {
              visitHistory : {
              timestamps : Date.now(),
               },
            },
        }
  );
  res.redirect(entry.redirectURL);
});


app.get("/check",(req,res)=>{
  return res.end("HELLO");
});

app.listen(PORT , () => console.log(`server started at port : ${PORT}`));


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
                        SOME IMPORTANT EXPLANATION 

  (1)cookie-parser => cookie-parser is a middleware that helps parse cookies attached to client requests.
                      It makes the cookies accessible through req.cookies.
    -It's often used in applications where you need to read or manage cookies 
    (e.g., for sessions, user authentication).
    
  (2)path => It's useful for handling and transforming file paths in a cross-platform manner
             (i.e., ensuring compatibility between Windows and Unix-based systems).


*/
