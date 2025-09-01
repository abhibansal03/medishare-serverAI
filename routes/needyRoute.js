var express=require("express");
var obj=require("../controllers/needyController");

var appRouter=express.Router();

appRouter.post("/picreader",obj.picReader);

appRouter.post("/details",obj.doSaveNeedyDetails);

appRouter.post("/fetchdetails",obj.doFetchNeedyDetails);

appRouter.post("/updatedetails",obj.doUpdateNeedyDetails);

module.exports=appRouter;