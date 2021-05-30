const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
const ObjectID=mongodb.ObjectID;




const databaseURL='mongodb://127.0.0.1:27017'
const databaseName='task-manager'

MongoClient.connect(databaseURL,{useNewUrlParser:true,useUnifiedTopology:true},(error,client)=>{
    if(error)
    {
        return console.log("Unable to connect to database");
    }

   const db=client.db(databaseName)
   
//    db.collection('users').updateOne({_id:new ObjectID("609ad622d077e2372c1c2166")},{
//        $set:{
//            name:"Andrew",
//            age:29
//        }
//    }).then((result)=>{
//        console.log("Updated successfully");
//    }).catch((error)=>{
//        console.log("Something went wrong")
//    })

//    db.collection('tasks').updateMany({completed:"false",completed:false},{
//        $set:{
//            completed:true
//        }
//    }).then((result)=>{
//        console.log("UPdated successfully");
//    }).catch((error)=>{
//        console.log("Something went wrong");
//    })

db.collection('tasks').deleteMany({completed:"false"}).then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})
})