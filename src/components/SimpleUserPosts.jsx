import { useState, useEffect } from "react";

function SimpleUserPosts() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("🔄 Starter parallel datahentning...");

      try {
        // Hent begge datasæt samtidig
        const startTime = Date.now();

        const [usersResponse, postsResponse] = await Promise.all([
          fetch("https://jsonplaceholder.typicode.com/users"),
          fetch("https://jsonplaceholder.typicode.com/posts"),
        ]);

        const [usersData, postsData] = await Promise.all([
          usersResponse.json(),
          postsResponse.json(),
        ]);

        const endTime = Date.now();
        console.log(`⚡ Data hentet på ${endTime - startTime}ms`);

        setUsers(usersData.slice(0, 5));
        setPosts(postsData);
      } catch (error) {
        console.error("❌ Fejl:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>⏳ Henter data fra to API kilder...</div>;
  }

  return (
    <div
      style={{
        border: "2px solid #007bff",
        padding: "20px",
        margin: "20px 0",
      }}
    >
      <h2>Users og deres Posts</h2>
      <p>
        📊 Data: {users.length} users og {posts.length} posts
      </p>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>
            {user.name} (User #{user.id})
          </h3>
          <p>📧 {user.email}</p>

          <h4>Posts af denne bruger:</h4>
          {posts
            .filter((post) => post.userId === user.id)
            .slice(0, 2)
            .map((post) => (
              <div
                key={post.id}
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "8px",
                  margin: "5px 0",
                }}
              >
                <strong>Post #{post.id}:</strong> {post.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default SimpleUserPosts;
