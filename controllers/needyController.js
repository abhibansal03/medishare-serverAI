var path=require("path");
var NeedycolRef=require("../models/needyModel");
require("dotenv").config();

var cloudinary=require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const { GoogleGenerativeAI }= require("@google/generative-ai");

const genAI= new GoogleGenerativeAI(process.env.GENERATIVE_AI);

const model= genAI.getGenerativeModel({model: "gemini-2.0-flash"});

async function aladdinKaChirag(imgurl){
const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([{
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();//this is regexp expression
            console.log(cleaned)
            const jsonData = JSON.parse(cleaned);
            console.log(jsonData);

    return jsonData;
}

async function aladdinKaChirag2(imgurl){
const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {address : ''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([{
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())
            
            const cleaned = result.response.text().replace(/```json|```/g, '').trim();//this is regexp expression
            //console.log(cleaned)
            const jsonData = JSON.parse(cleaned);
            console.log(jsonData);

    return jsonData;
}

function isAllFieldsPresent(data){
    return (
        data.name &&
        data.dob &&
    data.gender &&
    data.address &&
    data.adhaar_number
    )
}

async function picReader(req,resp){
    if(req.body.type == "front"){
        if(req.files){

            let path1 = path.join(__dirname , ".." , "uploads" , req.files.adhaarpic.name);
            await req.files.adhaarpic.mv(path1);

            try{
                await cloudinary.uploader.upload(path1).then(async function (picUrlResult){
                    let jsonData = await aladdinKaChirag(picUrlResult.url);

                    jsonData.aadharfrontpicpath = picUrlResult.url;
                    console.log(jsonData);
                    resp.send(jsonData)
            });
            }catch(err){
            resp.send(err.message);
            }
        }
    }else{//forbackside of aadhar card

        let path1 = path.join(__dirname , ".." , "uploads" , req.files.adhaarpic.name);
            await req.files.adhaarpic.mv(path1);
            try{
                await cloudinary.uploader.upload(path1).then(async function(picUrlResult) {
                    let jsonData = await aladdinKaChirag2(picUrlResult.url);

                    jsonData.aadharbackpicpath = picUrlResult.url;

                    resp.send(jsonData);
                })
            }catch(err){
                resp.send(err.message);
            }
    }
}

async function doSaveNeedyDetails(req,resp)
{
    console.log("*************************");
    var needyCol=new NeedycolRef(req.body);
    console.log("*************************");

    needyCol.save().then((docu)=>{
        resp.json({status:true,msg:"Needy Details Saved",obj:docu});
    }).catch((err)=>{
        resp.json({status:false,msg:err.message});
    })
}

async function doUpdateNeedyDetails(req,resp)
{
        /* await NeedycolRef.findOne({emailId:req.body.emailId}).then(function(docu){adhaarfront=docu.frontAdhar, adhaarback=docu.backAdhar}).catch((err)=>{
            resp.send({status:false,msg:"Pic URL Error"});
        })
    req.body.frontAdhar=adhaarfront;
    req.body.backAdhar=adhaarback; */

    await NeedycolRef.updateOne({emailId:req.body.emailId},{$set:req.body}).then((docu)=>{
        resp.json({status:true,msg:"Record Updated",obj:docu});
    }).catch((err)=>{
        resp.json({status:false,msg:err.message});
    })
}

function doFetchNeedyDetails(req,resp)
{
    NeedycolRef.findOne({emailId:req.body.emailId})
    .then((docu)=>{
        if(docu!=null){
            resp.json({status:true,msg:"Record Found",obj:docu});
        }
        else{
            resp.json({status:false,msg:"Details not Found"});
        }
    }).catch((err)=>{
        return resp.json({status:false,msg:err.message});
    });
}


module.exports={doSaveNeedyDetails, doUpdateNeedyDetails, doFetchNeedyDetails, picReader};