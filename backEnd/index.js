const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
const secretKey = 'my_secret_key';

mongoose
  .connect("mongodb://127.0.0.1:27017/simple_blog")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  slug: String,
  title: String,
  description: String,
  comments: [{ text: String }],
});


const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);


// test
app.get("/", (req, res) => {
  res.send("Server running");
});

//middlewares
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (typeof token !== "undefined") {
    jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
      if (err) {
        res.status(403).send("Invalid token");
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
}

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    return res.status(401).json({ message: "Login failed" });
  }
  jwt.sign(
    { user },
    secretKey,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) {
        res.status(500).send("Error generating token");
      } else {
        res.json({
          token,
          user: { username: user.username },
        });
      }
    }
  );
});

// POST SignUp
app.post("/api/signup", async (req, res) =>{
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  const exist = await User.findOne({ username });
  if (exist) {
    return res.status(400).json({ message: "Username exists" });
  }
  await User.create({ username, password });
  res.json({ message: "User created" }); 
});
// GET POSTS
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// CREATE POST
app.post("/api/post", async (req, res) => {
  const { slug, title, description } = req.body;

  const exist = await Post.findOne({ slug });
  if (exist) {
    return res.status(400).json({ message: "Slug exists" });
  }

  await Post.create({
    slug,
    title,
    description,
    comments: [],
  });

  res.json({ message: "Created!" });
});


app.get("/api/post/:slug", async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(post);
});

// Thêm cmt
app.post("/api/post/:slug/comment", async (req, res) => {
  const { text } = req.body;

  const post = await Post.findOne({ slug: req.params.slug });

  if (!post) {
    return res.status(404).json({ message: "Not found" });
  }

  post.comments.push({ text });
  await post.save();

  res.json({ message: "Comment added" });
});

app.get("/api/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});