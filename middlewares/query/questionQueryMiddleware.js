const {searchHelper,populateHelper,sortHelper,paginationHelper}=require("./queryMiddlewareHelper");
const asyncErrorWrapper=require("express-async-handler");
const questionQueryMiddleware=function(model,options){

return asyncErrorWrapper(async function(req,res,next){

//İnital
let questions=model.find();

//Search
questions=searchHelper("title",questions,req);
//----------------------------------------------------

//Populate

if(options && options.population)
{
    questions=populateHelper(questions,options.population);
}
//----------------------------------------------------

//Sort
questions=sortHelper(questions,req);

// // //----------------------------------------------------

// // //Pagination

// const total= await model.countDocuments();
// // //İçinde "await" kullandığımız için "await" ile çağırıyoruz ve obje olarak döndürdüğü için bir değişkenin içine alıyoruz.
// const paginationResults=await paginationHelper(total,questions,req); 

// questions=paginationResults.query;
// const pagination=paginationResults.pagination;



const total=await model.countDocuments();

const paginationResults=await paginationHelper(total,questions,req);

const pagination=paginationResults.pagination;
questions=paginationResults.query;

// //----------------------------------------------------


const data=await questions.find();

res.data={
    success:true,
    count:data.length,
    pagination:pagination,
    data:data
};

next();

});

};


module.exports=questionQueryMiddleware;