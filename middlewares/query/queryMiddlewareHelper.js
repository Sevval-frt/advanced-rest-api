const { parse } = require("dotenv");

const searchHelper=(searchKey,query,req)=>{

if(req.query.search)
{
    const searchObject={};

    const regex=new RegExp(req.query.search,"i"); //search key'ine karşılık gelen value. Büyük küçük harfe duyarlı
    
    searchObject[searchKey]=regex; //Arama iskeleti
    
    return query.where(searchObject);
};
return query;

};

//Populate 

const populateHelper=(query,population)=>{

return query.populate(population);

};

//Sort

const sortHelper=(query,req)=>{

if(req.query.sortBy)
{
    const sortKey=req.query.sortBy;

    if(sortKey==="most-answered")
    {
      return query.sort("-answerCount");//Defalut olarak küçükten büyüğe sıralar ama "-" işareti ile büyükten küçüğe.
    }
    if(sortKey==="most-liked")
    {
      return query.sort("-likeCount");//LikeCount'ları aynıysa tarihe göre küçükten büyüğe sırala.
    }

    return query.sort("createAt");//Default olarak küçükten büyüğe.
};

};

//Pagitanion 

const paginationHelper=async(total,schemas,req)=>{

const page=parseInt(req.query.page || 1);
const limit=parseInt(req.query.limit || 5);

const startIndex=(page-1)*limit;
const endIndex=page*limit;

const pagination={};

const totalCount=total;

if(startIndex > 0) //Önceki sayfa
{
    pagination.previous={
        page:page-1,
        limit:limit
    };
}

if(endIndex < totalCount) //Sonraki sayfa
{
    pagination.next={
        page:page+1,
        limit:limit
    };
}

return {
    query:schemas==="undefined" ? "undefined" : schemas.skip(startIndex).limit(limit),//paginate etme işlemi
    pagination:pagination //pagination obje görünümü
};

   

};

module.exports={searchHelper,populateHelper,sortHelper,paginationHelper};