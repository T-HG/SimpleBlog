import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { apiUrl, authHeaders } from "../lib/api";

function NewPost({ user }) {
  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddPost = async () => {
    setMessage("");
    setError("");

    try {
      const res = await fetch(apiUrl("/api/post"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Created!");
        setForm({
          slug: "",
          title: "",
          description: "",
        });
      } else {
        setError(data.message || "Create post failed");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <ProtectedRoute user={user}>
      <div style={{ padding: 20 }}>
        <h2>Add New Blog</h2>

        <input
          placeholder="slug"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
        />
        <br />
        <br />

        <input
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <br />
        <br />

        <textarea
          placeholder="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows="4"
          cols="30"
        />
        <br />
        <br />

        <button onClick={handleAddPost}>Add Blog</button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </ProtectedRoute>
  );
}

export default NewPost;
