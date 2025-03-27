import React from "react";
import UserAvatarImage from "../icons/mechanic.png"; // Make sure this path is correct!

const CustomUserAvatar = () => {
  return (
    <img
      src={UserAvatarImage}
      alt="User Avatar"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        objectFit: "cover"
      }}
    />
  );
};

export default CustomUserAvatar;
