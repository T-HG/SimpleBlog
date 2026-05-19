import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { apiUrl, authHeaders } from "../lib/api";

function PostDetail({ user }) {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");

  const loadPost = async () => {
    setError("");

    try {
      const res = await fetch(apiUrl(`/api/post/${slug}`));
      const data = await res.json();

      if (res.ok) {
        setPost(data);
      } else {
        setError(data.message || "Post not found");
      }
    } catch (err) {
      setError("Cannot load post");
    }
  };

  useEffect(() => {
    loadPost();
  }, [slug]);

  const addComment = async () => {
    if (!comment.trim()) return;

    try {
      const res = await fetch(apiUrl(`/api/post/${slug}/comment`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({ text: comment }),
      });

      if (res.ok) {
        setComment("");
        loadPost();
      } else {
        setError("Cannot add comment");
      }
    } catch {
      setError("Cannot add comment");
    }
  };

  return (
    <ProtectedRoute user={user}>
      <div style={{ padding: 20 }}>
        <h2>Post Detail</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {post && (
          <>
            <div>
              <h3>{post.title}</h3>
              <p>
                <strong>Slug:</strong> {post.slug}
              </p>
              <p>{post.description}</p>
            </div>

            <h2>Comments</h2>

            {post.comments?.length === 0 && <p>No comments yet</p>}

            <ul>
              {post.comments?.map((c, index) => (
                <li key={c.id ?? index}>{c.text}</li>
              ))}
            </ul>

            <input
              placeholder="Write comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={addComment}>Add Comment</button>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default PostDetail;
