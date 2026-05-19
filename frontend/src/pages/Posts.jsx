import { useState } from "react";
import { Link } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { apiUrl } from "../lib/api";

function Posts({ user }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");

    try {
      const res = await fetch(apiUrl("/api/posts"));
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      setError("Cannot load posts");
    }
  };

  return (
    <ProtectedRoute user={user}>
      <div style={{ padding: 20 }}>
        <h2>Posts</h2>
        <button onClick={load}>Load Posts</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {data.map((p) => (
            <li key={p.slug}>
              <Link to={`/posts/${p.slug}`}>
                <strong>{p.title}</strong>
              </Link>
              {" - "}
              {p.description}
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}

export default Posts;
