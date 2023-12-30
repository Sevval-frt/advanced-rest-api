const mongoose = require("mongoose");
const bcrypt=require("bcryptjs");
const Schema = mongoose.Schema;
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const { parse } = require("path");
const Question=require("./question");

const userSchema = new Schema({

    name:{
        type:String,
        required:[true,'Please provide a name'] //Alan boş geçilemez.
    },
    email:{
        type:String,
        required:[true,'Please provide a email'],
        trim: true,
        unique:true, //Aynı E-mail'den bir kere kayıt olunması gerekli!
        match:[//@ işaretine eşleşmesi gerekli (reg ex)
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
             'Please provide a valid email']
    },
    role:{
        type:String,
        default:'user',
        enum:['user','admin'] //Tercihe göre "superadmin , guest" gibi alanlar eklenebilir...
    },
    password:{
        type:String,
        minlength:[6,'Please provide a password with min length : 6'],
        required:[true,'Please provide a password !'],
        select:false // Veriler çekildiğinde görünmemesi için: select:false , görünmesi için: select:true
    },
    createAt:{
        type:Date,
        default:Date.now, 
    },
    title:{
        type:String
    },
    about:{
        type:String
    },
    place:{
        type:String
    },
    website:{
        type:String
    },
    profile_image:{
        type:String,
        default:"default.jpg"
    },
    blocked:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }

});

//UserSchema Metods:
userSchema.methods.generateJwtFromUser=function(){

const {JWT_SECRET_KEY,JWT_EXPIRE}=process.env;

    const payload={
        id:this._id,
        name:this.name
    };

const token=jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn:JWT_EXPIRE
    });

    return token;
};

userSchema.methods.getResetPasswordTokenFromUser=function(){

    const randomHexString=crypto.randomBytes(15).toString("hex");
    
    const {RESET_PASSWORD_EXPIRE}=process.env;

    const resetPasswordToken=crypto
    .createHash("SHA256").
    update(randomHexString).
    digest("hex");
 
    this.resetPasswordToken=resetPasswordToken;
    this.resetPasswordExpire=Date.now()+parseInt(RESET_PASSWORD_EXPIRE);//1saat "milisaniye" cinsi

    return resetPasswordToken;

};

userSchema.pre("save",function(next){

    //Eğer şifre değiştirilmediyse
    if(!this.isModified("password"))
    {
        next();
    }

    bcrypt.genSalt(10, (err, salt)=>{

        if(err) next(err);//Eğer hata varsa "Custom Error Middleware"a gönderebiliriz.

        bcrypt.hash(this.password, salt,(err, hash)=>{

            if(err) next(err);
            this.password=hash;
            next();
        });
    });
});

userSchema.post("findOneAndDelete",async function(doc,next){

try{
    await Question.deleteMany({ //Birden fazla Question silinebilir, dolayısıyla obje olarak yazıyoruz.

        user:doc._id //Sildiğimiz User id alanı hangi Question Schemasının user alanındaysa onları siler. 
                      // Yani Sildiğimiz User'a ait olan Questions'ları siler.
    });
}
catch(err)
{
    return next(err);
}

});

module.exports=mongoose.model("User",userSchema);