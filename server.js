import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import User from "./model/User.js";
import Todos from "./model/Todos.js";
import mongoose from "mongoose";
import path from "path";

dotenv.config();
const app = express();
const port =process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//Step
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, ' frontend', 'build')));
};

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});


//Connect to MongoDB
const dbURI = process.env.CLOUD_DB_URI;
mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
    })
    .then(result =>{
        app.listen(port, () =>{
            console.log(`Listening on port ${port}`);
        });
    }).catch(err=>{
        console.log(err);
    });

//API routes
app.post("/register", async (req, res) => {
  const { username, password , confirmpassword} = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: "User already exists!",
    });
    return;
  }
  if(username == "" || password == "" || confirmpassword == ""){
    res.status(500);
    res.json({message: "Empty field is not allowed!"})
    return;
  }
  if(password !== confirmpassword){
    res.status(500);
    res.json({message: "Password doesn't match!"})
    return;
  }
  await User.create({ username, password });
  res.json({
    message: "success",
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid login",
    });
    return;
  }
  res.json({
    message: "success",
  });
});


app.post("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, ] = token.split(":");
  const todosItem = req.body.text;
  await Todos.create({createdBy: username, content: todosItem});
  res.json({message: "new content saved!"});
});

app.get("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  await Todos.find({createdBy: username }).exec((err, value) =>{res.json(value)});
});

app.post("/update", async (req, res) =>{
  const ID = req.body;
  await Todos.findByIdAndUpdate(ID.id , {'done' : true}).exec();
  res.json({message: "updated"});
});

app.delete("/delete", async (req, res)=>{
  const ID = req.body;
  await Todos.findByIdAndDelete(ID.id).exec();
  res.json({message:"deleted"})
});

