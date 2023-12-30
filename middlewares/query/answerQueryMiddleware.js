const asyncErrorWrapper=require("express-async-handler");
const {populateHelper,paginationHelper}=require("./queryMiddlewareHelper");

const answerQueryMiddleware=function(model,options){
    return asyncErrorWrapper(async function(req,res,next){

        const {id}=req.params;

        const arrayName="answers";

        const total=(await model.findById(id))["answerCount"]; //Question[7] = 7

    //Pagination-slice(dilimleyerek gösterme)

        const paginationResult=await paginationHelper(total,undefined,req);

        const startIndex=paginationResult.startIndex;
        const limit=paginationResult.limit;
        const pagination=paginationResult.pagination;

        let queryObject={};

        queryObject[arrayName]={$slice:[startIndex,limit]};//dilimleme iskeleti

        let query=model.find({_id:id},queryObject);
        //--------------------------------------------------------------------------------

        //Populate

        query=populateHelper(query,options.population);

 //--------------------------------------------------------------------------------

        const data=await query;

    res.data={
        success:true,
        count:data.length,
        pagination:pagination,
        data:data

    };

        next();

    });

};


module.exports=answerQueryMiddleware;