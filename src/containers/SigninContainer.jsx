import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import { signupAPI } from "../api/authAPi";

const SigninContainer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await signupAPI({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <SignIn  // add name prop
      name={formData.name}
      email={formData.email}
      password={formData.password}
      onChange={handleChange}
      onSubmit={handleSubmit}
      error={error}
    />
  );
};

export default SigninContainer;
