import { useState, useEffect } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { apiUrl, authHeaders } from "../lib/api";

function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setError("");

    try {
      const res = await fetch(apiUrl("/api/users"), {
        headers: authHeaders(),
      });
      const data = await res.json();

      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message || "Cannot load users");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <ProtectedRoute user={user}>
      <div style={{ padding: 20 }}>
        <h2>Users</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {users.map((u) => (
            <li key={u._id}>{u.username}</li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}

export default Users;
