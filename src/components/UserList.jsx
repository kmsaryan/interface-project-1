import React from "react";
import "../styles/UserList.css"; // Import styles

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className={`user ${user.status}`}>
          {user.name} ({user.status})
        </div>
      ))}
    </div>
  );
};

export default UserList;
