import React, { useState, useEffect } from "react";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  async function fetchPosts() {
    try {
      setLoading(true);

      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) {
        throw new Error(`Fejl ${response.status}: Kunne ikke hente data`);
      }

      const data = await response.json();
      setPosts(data.slice(0, 10));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser =
      selectedUserId === "" || post.userId.toString() === selectedUserId;

    return matchesSearch && matchesUser;
  });

  return (
    <div className="posts-section">
      <h2>Latest Posts</h2>
      {/* Søgefelt */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Søg i posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />

        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="">👥 Alle brugere</option>
          {[1, 2, 3, 4, 5].map((id) => (
            <option key={id} value={id}>
              User {id}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>⏳ Henter posts...</p>}
      {!loading && (
        <>
          <p>
            📊 Viser {filteredPosts.length} af {posts.length} posts
          </p>
          <ul className="posts-list">
            {filteredPosts.map((post) => (
              <li key={post.id} className="post-item">
                <h3>
                  Post #{post.id}: {post.title}
                </h3>
                <p>{post.body.substring(0, 100)}...</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default PostList;
