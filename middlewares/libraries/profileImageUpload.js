const multer=require("multer");
const path=require("path");
const CustomError=require("../../helpers/error/CustomError");

//Storage , FileFilter

const storage=multer.diskStorage({

    //Kaydedilecek yer
    destination: function(req,file,cb){

        //Root Directory - server.js
        const rootDir=path.dirname(require.main.filename);
        cb(null,path.join(rootDir,"/public/uploads"));

    },

    //Kaydedilecek dosya ismi ve şekli
    filename:function(req,file,cb){

        //File Mimtype - image/jpg
        const extension=file.mimetype.split("/")[1];
        req.savedProfileImage="image_"+req.user.id+"."+extension;//kaydetme şekli
        cb(null,req.savedProfileImage); //kaydetme
    }

});

const fileFilter=(req,file,cb)=>{

    let allowedMimeTypes=["image/jpg","image/jpeg","image/png","image/gif"];

    if(!allowedMimeTypes.includes(file.mimetype))
    {
        return cb(new CustomError("Please provide a valid image file",400),false);
    }
    return cb(null,true);

};

const profileImageUpload=multer({storage,fileFilter});

module.exports={profileImageUpload};