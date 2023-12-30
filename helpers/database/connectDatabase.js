const mongoose=require("mongoose");

const connectDatabase = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology:true
    })
    .then(() => {
      console.log("MongoDB connection successful");
    })
    .catch((err) => {
      console.log(`${err}`);
    });
};

module.exports=connectDatabase;
 