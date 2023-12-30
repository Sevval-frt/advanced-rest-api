const User=require("../models/user");
const CustomError=require("../helpers/error/CustomError");
const asyncErrorWrapper=require("express-async-handler");
const {sendJwtToClient}=require("../helpers/authorization/tokenHelpers");
const {validateUserInput,comparePassword}=require("../helpers/input/inputHelpers");
const {sendEmail}=require("../helpers/libraries/sendEmail");

const register=asyncErrorWrapper(async(req,res,next)=>{

    //POST DATA
    const {name,password,email,role} = req.body;

    //NOT: ES6+ versiyonlarında aynı isimli değişkenler olduğunda sadece birini yazabiliriz. (Kısa ve pratik bir yöntem)
    const user= await User.create({
    name, // -> Aslında name:name,
    password,
    email,
    role
    });

    sendJwtToClient(user,res);

});

const login=asyncErrorWrapper(async(req,res,next)=>{

    const {email,password}=req.body;

    //Inputları kontrol etme,boş olmaması için.
    if(!validateUserInput(email,password))
    {
       return next(new CustomError("Please check your inputs.",400));
    }

    //Girdiğimiz email ve şifreye göre kullanıcıyı eşleme ve gösterme
    const user=await User.findOne({email}).select("+password");

   if (!comparePassword(password,user.password))
   {
    return next(new CustomError("Please check your credentials.",400));
   };
 
   sendJwtToClient(user,res);

});

const logout=asyncErrorWrapper(async(req,res,next)=>{

const {NODE_ENV} =process.env;

  return res.status(200).cookie({
        httpOnly:true,
        expires: new Date(Date.now()), //Cookie'yi imha etme
        secure: NODE_ENV==="development" ? false : true
      }).json({
        success:true,
        message:"Logout successfull"
    });

});

const getUser=(req,res,next)=>{
    res.json({
        success:true,
        data:{
            id:req.user.id,
            name:req.user.name
        }
    });
};

const imageUpload=asyncErrorWrapper(async(req,res,next)=>{

    //Image Upload Success

    const user= await User.findByIdAndUpdate(req.user.id,{
         "profile_image":req.savedProfileImage
    },
    {
        new:true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        message:"Image upload successfull",
        data:user
    });
});

const forgotpassword=asyncErrorWrapper(async(req,res,next)=>{

const resetEmail=req.body.email;

const user=await User.findOne({email:resetEmail});

    if(!user)
    {
    return next(new CustomError("There is no user with that email",400));
    };


const resetPasswordToken=user.getResetPasswordTokenFromUser();

   await user.save(); //-> Şemaya token ve expire'ı ekleyerek yeni ve güncel olarak tekrar kaydediyoruz.

   //Reset password'ü sorgusuyla beraber göndereceğimiz adres.
    const resetPasswordUrl=`http://localhost:8080/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate= `<h3> Reset Your Password </h3>
                        <p> This <a href='${resetPasswordUrl}' target ='_blank'> Link </a> will expire in 1 hour </p>`;


    //Try içinde herhangi bir problem çıkarsa reserpasswordtoken ve resetpasswordexpire'ı undefined yapmamız gerekiyor!
    //Yani Merkezi CustomErrorHandler değil kendi ErrorHandler'ımızı kullanıyoruz.
    try{

        await sendEmail({
            from:process.env.SMTP_USER,
            to:resetEmail,
            subject:"Reset Your Password",
            html:emailTemplate
        });

       return res.status(200).json({
            success:true,
            message:"Token sent to your email"
        });
    }
    //Eğer hatayı merkezi bir yerden yakalasaydık "undefined"a çeviremezdik!
    catch(err)
    {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save();

        return next(new CustomError("Email could not be sent ",500));
    }

});

const resetPassword=asyncErrorWrapper(async(req,res,next)=>{

    const {resetPasswordToken}=req.query; //reset password token'i alıyoruz.
    const {password}=req.body; //Girilen yeni şifreyi alıyoruz.

    if(!resetPasswordToken)
    {
        return next(new CustomError("Please provide a valid token",400));
    }

    //resetPasswordToken 'a göre kullanıcıyı seçiyoruz.
    let user= await User.findOne({
        resetPasswordToken:resetPasswordToken, //Schema'daki token ile resetleme linkindeki token aynı olduğundan karşılaştırma yaparak Schema'yı çekiyoruz.
        resetPasswordExpire: {$lte: Date.now()} //Eğer resetPasswordExpire şuanki zamandan büyükse (ki büyük olmalı) Schema 'yı getirsin.
        //NOT: Burda Mongodb'ye 4 saat geriden kaydettiği için $gt (greater than) olanı $lte(less than or equal) olarak değiştirdim.
        //Maalesef mantık hatası var şimdilik böyle devam ettik.
    });

    if(!user)
    {
        return next(new CustomError("Invalid token or session expired",404));
    };

    //Kullanıcıya ait Schema'yı token'a göre bulup çektiğimize göre güncelleme işlemini gerçekleştirebiliriz.
    user.password=password;//Update
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    res.status(200).json({
        success:true,
        message:"Reset password proccess successfull"
    });

});

const editProfile=asyncErrorWrapper(async(req,res,next)=>{

    const editInformation=req.body;

    const user= await User.findByIdAndUpdate(req.user.id,editInformation,//Önceki Middleware'daki değişken
        {
        new:true,
        runValidators:true
        });


    return res.status(200).json({
        success:true,
        data:user
    });

});

module.exports={register,getUser,login,logout,imageUpload,forgotpassword,resetPassword,editProfile};