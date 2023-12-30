const asyncErrorWrapper=require("express-async-handler");
const {searchHelper,paginationHelper}=require("./queryMiddlewareHelper");
const userQueryMiddleware=function(model){

return asyncErrorWrapper(async function(req,res,next){

    let users=model.find();

//Search
users=searchHelper("name",users,req);
//----------------------------------------

//Pagination

const total=await model.countDocuments();

const paginationResults=await paginationHelper(total,users,req);

const pagination=paginationResults.pagination;
users=paginationResults.query;

//----------------------------------------

const data=await users.find();

res.data={
    success:true,
    count:data.length,
    pagination:pagination,
    data:data
    };

    next();

    });

};

module.exports=userQueryMiddleware;


