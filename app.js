const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
mongoose.connect("mongodb://localhost:27017/nodeKeeperDB")
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" , "ejs")

const noteSchema = new mongoose.Schema({
    title:String,
    content:String,
})

const note = new mongoose.model("note" , noteSchema);


app.get("/", (req, res)=>{
    note.find({}, (err, docs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("home", {docs:docs ,  msg:"No current notes! You can add notes which will show up here"});
        }
    })
})




app.post("/add" ,(req, res)=>{
    const {title , content} = req.body;
    
      const noteObj = new note({
          title,
          content
      })
      
      noteObj.save(()=>{
        note.find({}, (err, docs)=>{
            if(err){
                console.log(err);
            }else{
                res.render("home", {docs:docs,  msg:"No current notes! You can add notes which will show up here"});
              
            }
        })
      });
} )


app.post("/delete",(req,res)=>{
    const id = req.body.btn;
    note.deleteOne({_id:id}, ()=>{
        note.find({},(err,docs)=>{
             if(err){
                 console.log(err);
             }else{
                 res.render("home" , {docs:docs , msg:"No current notes! You can add notes which will show up here"})
             }
        })
    } )
   
})

app.post("/search",(req,res)=>{
    const search = req.body.search;
   
        note.find({title:search},(err,docs)=>{
             if(err){
                 console.log(err);
             }else{
                 res.render("home" , {docs:docs , msg: "Oops! No matches found,retry with different words."})
             }
        })
   
})

app.listen(3000, ()=>{
    console.log("server running on pert 3000");
})