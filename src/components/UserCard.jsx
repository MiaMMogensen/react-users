import { useState, useEffect } from "react";

function UserCard({ user, onDelete }) {
  const { name, mail, title, image, id } = user;
  const [likes, setLikes] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (likes === 10) alert("Du har nået 10 likes!");
  }, [likes]);

  return (
    <div className="user-card">
      <p>{title}</p>
      <img src={image} />
      <h2>{name}</h2>
      <button className="knap" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Skjul" : "Vis"} detajler
      </button>
      <button className="knap" onClick={() => setLikes(likes + 1)}>
        Like ({likes})
      </button>
      <button className="knap" onClick={() => setLikes(0)}>
        Reset likes
      </button>
      <button className="knap" onClick={() => onDelete(user.id)}>
        Slet
      </button>
      {showDetails && (
        <div>
          <p>Mail: {mail}</p>
          <p>Id: {id}</p>
        </div>
      )}
    </div>
  );
}
export default UserCard;
