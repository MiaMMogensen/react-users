import { useEffect, useState } from "react";
import User from "./components/User";
import Header from "./components/Header";
import UserList from "./components/UserList";
import Footer from "./components/Footer";
import PostList from "./components/PostList";
import SimpleUserPosts from "./components/SimpleUserPosts";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTitle = selectedTitle === "" || user.title === selectedTitle;
    return matchesName && matchesTitle;
  });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/cederdorff/race/master/data/users.json"
        );
        const data = await response.json();

        setUsers(data);
      } catch (error) {
        console.log("Fejl ved hetning af brugere:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length === 0) alert("Ingen brugere!");
  }, [users]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const newUser = {
      id: crypto.randomUUID(),
      name: form.name.value,
      mail: form.mail.value,
      title: form.title.value,
      image: form.image.value,
      age: form.age.value,
    };

    console.log("Sender til server:", newUser);

    try {
      // Simuler POST til server
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      console.log("Response status:", response.status);

      const serverResponse = await response.json();
      console.log("Server svarede:", serverResponse);

      // Tilføj til lokal liste (med vores eget ID)
      const userWithId = {
        ...newUser,
        id: crypto.randomUUID(),
      };

      setUsers([...users, userWithId]);
      form.reset();

      alert("✅ Bruger tilføjet!");
    } catch (error) {
      console.error("❌ Fejl:", error);
      alert("Kunne ikke tilføje bruger: " + error.message);
    }
  }

  async function handleDeleteUser(id) {
    console.log("Sletter bruger med ID:", id);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      console.log("Delete response status:", response.status);

      setUsers(users.filter((user) => user.id !== id));
      console.log("✅ Bruger slettet lokalt");
    } catch (error) {
      console.error("❌ Fejl ved sletning:", error);
      alert("Kunne ikke slette bruger: " + error.message);
    }
  }

  return (
    <div className="page">
      <Header />
      <section>
        {loading && <p>Loading...</p>}

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Navn" />
          <input name="mail" placeholder="Mail" />
          <input name="title" placeholder="Titel" />
          <input name="image" placeholder="Billede-URL" />
          <input name="age" placeholder="Alder" />
          <button type="submit">Tilføj bruger</button>
        </form>

        <div className="filters">
          <input
            className="input-soeg"
            type="text"
            placeholder="Søg efter navn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          <p>Viser {filteredUsers.length} brugere</p>
          <select
            className="soegefelt"
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            <option value="">Alle titler</option>
            <option value="Senior Lecturer">Senior Lecturer</option>
            <option value="Head of Department">Head of Department</option>
            <option value="Senior Lecturer & Internship Coordinator">
              Senior Lecturer & Internship Coordinator
            </option>
            <option value="Lecturer">Lecturer</option>
          </select>
        </div>

        <UserList users={filteredUsers} onDelete={handleDeleteUser} />
        <PostList />
        <SimpleUserPosts />
      </section>
      <Footer />
    </div>
  );
}

export default App;
