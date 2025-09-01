var express=require("express");
var fileuploader=require("express-fileupload");
const cors=require("cors");
var needyRoute=require("./routes/needyRoute");
let mongoose = require("mongoose");

var dotenv=require("dotenv");
var env=dotenv.config();

var app=express();

app.use(express.static("public"));
app.use(express.urlencoded(true));
app.use(cors());
app.use(express.json());


app.use(fileuploader());

let mongodbAtlasUrl=process.env.MONGODB_URI;
mongoose.connect(mongodbAtlasUrl).then(()=>{
    console.log("Connected");
})
.catch((err)=>{
    console.log(err.message);
});

app.use("/needy",needyRoute);

app.use("/",(req,resp)=>
    {
        resp.send("Welcome");
})

app.listen(process.env.PORT, function() {
    console.log(`Server AI Started @ ${process.env.PORT}`);
})