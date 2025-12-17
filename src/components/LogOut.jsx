import React from "react";

const LogOut = () => {
  const handleLogOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return <button onClick={handleLogOut}>log out</button>;
};

export default LogOut;
