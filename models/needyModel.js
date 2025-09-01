var mongoose =require("mongoose");

var needyObj={
    emailId: {type:String, require:true, index:true,unique:true},
    contactNumber:Number,
    name:String,
    dob:Date,
    gender:String,
    address:String,
    medicalCondition:String,
    frontAdhar:String,
    backAdhar:String,
    status: { type: Number, immutable:true,default:1 },
}

var ver={
    versionKey: false,
};

const schema=new mongoose.Schema(needyObj,ver);
var NeedycolRef=mongoose.model("NeedyProfile",schema);

module.exports=NeedycolRef;