import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import { loginAPI } from "../api/authAPi";

const LoginContainer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setError("");

    try {
      const response = await loginAPI({
        email: formData.email,
        password: formData.password,
      });

      // assuming backend sends token
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Login
      email={formData.email}
      password={formData.password}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};

export default LoginContainer;
