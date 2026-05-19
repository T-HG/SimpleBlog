import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Posts from "./pages/Posts";
import NewPost from "./pages/NewPost";
import PostDetail from "./pages/PostDetail";
import Users from "./pages/Users";
import SignUp from "./pages/SignUp";

function AppShell() {
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav style={{ padding: 10 }}>
        <Link to="/">Home</Link> | <Link to="/posts">Posts</Link> |{" "}
        <Link to="/newpost">New Blog</Link> | <Link to="/users">Users</Link> |{" "}
        <Link to="/login">Login</Link> | {" "}
        <Link to="/signup">Sign Up</Link>
        {user && (
          <>
            {" | "}
            <button onClick={logout}>Logout</button>
          </>
        )}
      </nav>

      {user && <p style={{ paddingLeft: 10 }}>Welcome, {user.username}</p>}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/posts" element={<Posts user={user} />} />
        <Route path="/posts/:slug" element={<PostDetail user={user} />} />
        <Route path="/newpost" element={<NewPost user={user} />} />
        <Route path="/users" element={<Users user={user} />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
}

export default AppShell;
