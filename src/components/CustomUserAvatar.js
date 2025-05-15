import React from "react";
import UserAvatarImage from "../assets/icons/mechanic.png"; // Updated path

const CustomUserAvatar = () => {
  return (
    <img
      src={UserAvatarImage}
      alt="User Avatar"
      style={{
        width: "40px",
        height: "40px",
        marginRight: "20px",
        borderRadius: "50%",
        objectFit: "cover"
      }}
    />
  );
};

export default CustomUserAvatar;
