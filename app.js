const express = require("express");
const bodyParser = require ("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/wikidb", {useNewUrlParser: true});
// mongoose.connect(process.env.MONGO_URL)

// async function connectToDatabase() {
//  const client = await MongoClient.connect('mongodb://localhost:27017');
//  database = client.db('file-demo');
// }
const articleSchema = {
    title: {type: String},
    content: {type: String } 
}


const Article = mongoose.model("Artcle", articleSchema);
// request targeting all articles

app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles)
        }else
        {
            res.send(err)
        }
        console.log(foundArticles);
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.sendStatus("content added successfully")
        }else{
            res.send("there is some err")
        }
    });
})
.delete(function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted")
        } else{
            res.send("there is an error")
        }
    });
});


// request targeting specific  articles

app.route("/articles/:titleOne")
.get(function(req, res){
    Article.findOne({title: req.params.titleOne}, function(err, foundArticle){
        if(!err){
            res.send(foundArticle)
        }else{
            res.send("No article matching with this article")
        }

    });
})
.put(function(req, res){
    Article.updateOne(
        {title: req.params.titleOne},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("updated successfully")
            }else{
                res.send("not added")
            }
        })
        
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.titleOne},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("updated successfully")
            }else{
                res.send("not updated")
            }
        }

    )
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.titleOne},
        function(err){
            if(!err){
                res.send("deleted successfully")
            }else{
                res.send("not deleted")
            }
        }
    )
})


app.listen(3000, function(){
    console.log("server started on port 3000")
});
