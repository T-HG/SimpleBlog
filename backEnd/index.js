const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const secretKey = process.env.JWT_SECRET || "dev_secret_key";
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "simple_blog";

if (!mongoUri) {
  console.error("Missing MONGODB_URI environment variable");
  process.exit(1);
}

// CONNECT MONGODB ATLAS
mongoose
  .connect(mongoUri, { dbName: mongoDbName })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// SCHEMA
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const postSchema = new mongoose.Schema({
  slug: String,
  title: String,
  description: String,
  comments: [{ text: String }],
  author: String,
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// TEST
app.get("/", (req, res) => {
  res.send("Server running");
});

// JWT MIDDLEWARE
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
    return res.status(401).json({
      message: "Login failed",
    });
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
          user: {
            username: user.username,
          },
        });
      }
    }
  );
});

// SIGNUP
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const exist = await User.findOne({ username });

  if (exist) {
    return res.status(400).json({
      message: "Username exists",
    });
  }

  await User.create({
    username,
    password,
  });

  res.json({
    message: "User created",
  });
});

// GET POSTS
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// CREATE POST
app.post("/api/post", verifyToken, async (req, res) => {
  const { slug, title, description } = req.body;

  const exist = await Post.findOne({ slug });

  if (exist) {
    return res.status(400).json({
      message: "Slug exists",
    });
  }

  await Post.create({
    slug,
    title,
    description,
    comments: [],
    author: req.user.username,
  });

  res.json({
    message: "Created!",
  });
});

// GET SINGLE POST
app.get("/api/post/:slug", async (req, res) => {
  const post = await Post.findOne({
    slug: req.params.slug,
  });

  if (!post) {
    return res.status(404).json({
      message: "Not found",
    });
  }

  res.json(post);
});

// COMMENT
app.post("/api/post/:slug/comment", verifyToken, async (req, res) => {
  const { text } = req.body;

  const post = await Post.findOne({
    slug: req.params.slug,
  });

  if (!post) {
    return res.status(404).json({
      message: "Not found",
    });
  }

  post.comments.push({
    text,
  });

  await post.save();

  res.json({
    message: "Comment added",
  });
});

// USERS
app.get("/api/users", verifyToken, async (req, res) => {
  const users = await User.find().select("-password");

  res.json(users);
});

// START SERVER
const PORT = process.env.PORT || process.env.BACKEND_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
