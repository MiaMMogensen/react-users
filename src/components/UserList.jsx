import UserCard from "./UserCard";

function UserList({ users, onDelete }) {
    return (
      <div className="grid">
        {users.map(user => (
          <UserCard user={user} key={user.id} onDelete={onDelete} />
        ))}
      </div>
    );
  }
  export default UserList;