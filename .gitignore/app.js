//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');//loadash for the _.lowerCase method
const fp = require('lodash/fp');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogsiteDB", {useNewUrlParser:true, useUnifiedTopology:true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//--------------- this get renders the home route and the sends the corresponding data to the home.ejs page----------------------
app.get("/", function(req,res){

 BlogPost.find({}, function (err, foundPosts){ //finds all posts from the BlogPost collection and puts them in a variable called "foundPosts"
  res.render("home", {
    homeEntry: homeStartingContent,
    blog: foundPosts // all found posts are mapped to ejs variable "blog" to be passed to home.ejs
  });
});
});

app.get("/about", function(req,res){
  res.render("about", {
    aboutEntry: aboutContent
  });
});

app.get("/contact", function(req,res){
  res.render("contact", {
    contactEntry: contactContent
  });
});

app.get("/compose", function(req,res){
  res.render("compose", {
  });
});

// creation of schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  blog: String
});

//creation of model collection
const BlogPost = mongoose.model("blogPost", blogPostSchema);


//--------- after clicking on more in the home page, this will get you to post.ejs with the prope post and its mongo _id ----------------------------------
app.get("/posts/:requestedPostID", function(req,res){ //express will capture whatever it is written after the : sign
  let postID = req.params.requestedPostID//this converts whatever is typed after the : (in this case _id and mappes it to PostID)

  BlogPost.findOne({_id:postID}, function(err, foundPost){ //finds the one post with the matching mongo id and renders it in the /post extension
      res.render("post", {
        title: foundPost.title,
        blog: foundPost.blog
      });
  });
});


//---------this post captures the blogTitle and the blogBody from the /compose route, creates an object and pushes it into the posts array-------------
app.post("/compose", function(req,res){

    const blogTitle = req.body.postTitle;
    const blogBody = req.body.postBody;

    const blogEntry = new BlogPost ({
      title: blogTitle,
      blog: blogBody
    });

    blogEntry.save();


  res.redirect("/");
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
