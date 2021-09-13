const express = require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");

const app=express();

// let worklist=[];

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema=new mongoose.Schema({
  name:String
});

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
  name:"Welcome To Your ToDoList "
});

const item2=new Item({
  name:"Hit + to add new items"
});

const item3=new Item({
  name:"Hit <- to delete items"
});

let defaultArray=[item1,item2,item3];

 /*  */
 const listSchema={
   name:String,
   items:[itemsSchema]
 }
 const List=mongoose.model("List",listSchema);

let c=0;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

let day="";
let cDay="";
// let items=["Do Exercise","Listen Relaxation Tape"];
let l=0;
let value="";

app.get("/",function(req,res){

  var today=new Date();
  var currentDay=today.getDay();
  switch(currentDay)
  {
    case 0:cDay="Sunday To Do List..";
    break;
    case 1:cDay="Monday To Do List..";
    break;
    case 2:cDay="Tuesday To Do List..";
    break;
    case 3:cDay="Wednesday To Do List..";
    break;
    case 4:cDay="Thursday To Do List..";
    break;
    case 5:cDay="Friday To Do List..";
    break;
    case 6:cDay="Saturday To Do List..";
    break;

  }
value="list";
//  console.log(date.date);// date() as running function is called
//  console.log(date.day());// anonnymous function is called thats why () is required

   Item.find({},function(err,result){
     if(result.length===0)//adding Defaults
     {
       c++;
       Item.insertMany(defaultArray,function(err){
        if(err)
        console.log("unable to add array of items");
        else
        console.log("Successfully added array of items");
      });
      res.redirect("/");
     }

     else
    res.render("list",{currentDay:currentDay,day:day,kindOfDay:cDay,l:result.length,itemslist:result});

  })

})

app.post("/",function(req,res){
  let listItem=req.body.AddToList;

let listName=req.body.AddBtn;

console.log(listName);
console.log(cDay);

  const item=new Item({
  name:listItem
});

if(listName===cDay)
{
  if(c===1)
  {

    Item.deleteMany({},function(err){
     if(err)
     console.log("unsucessfull To delete");
     else
     {
       Item.insertMany(item ,function(err){
        if(err)
        console.log("unable to add array of items");
        else{
          c=0;
        res.redirect("/");

        }
       });

     }
   });
  }
  else{

    Item.insertMany(item ,function(err){
     if(err)
     console.log("unable to add array of items");
     else
     res.redirect("/");
    });
  }

}
else{
  List.findOne({name:listName},function(err,foundList){
//console.log(foundList.items);
//console.log(defaultArray);
    if(foundList.items[0].name===defaultArray[0].name && foundList.items[1].name===defaultArray[1].name && foundList.items[2].name===defaultArray[2].name)
    {
      //console.log("hi");
      foundList.items=[];
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    }else{
      //console.log("hi2");
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    }
  })
}



/*  console.log(req.body.AddBtn);

  if(req.body.AddBtn === "list")
  {
    items.push(listItem);
  res.redirect("/")
}
else{
  worklist.push(listItem);
  res.redirect("/work");
} */

});

app.post("/delete",function(req,res){
  Item.deleteOne({_id:req.body.DeleteBtn},function(err){
    if(err)
    console.log("Delete unsucessfull");
    else
    res.redirect("/");
});

});

app.get("/:CustomList",function(req,res){
const customList=req.params.CustomList;

  List.findOne({name:customList},function(err,foundArray){
    if(!err)
    {

      if(!foundArray){

        const list=new List({
          name:customList,
          items:defaultArray
        });
        list.save();
        res.redirect("/"+customList);
      }else{
        res.render("list",{currentDay:"Today",day:"Today",kindOfDay:foundArray.name,l:foundArray.items.length,itemslist:foundArray.items});
      }
    }
  });
/*value="work list";
  res.render("list",{currentDay:"",day:day,kindOfDay:"Work List",l:worklist.length,itemslist:worklist,value:value})*/
})

app.get("/about",function(req,res){
  res.render('about',{});
})

app.listen(3000,function(){
  console.log("server started");
})
