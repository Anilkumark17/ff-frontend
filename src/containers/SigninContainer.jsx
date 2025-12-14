import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignIn from "../components/SignIn";
import { signUpUser, signInUser } from "../api/authAPI";


const SigninContainer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (isSignup) {
        await signUpUser(form);
      } else {
        await signInUser(form);
      }
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SignIn
      {...form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isSignup={isSignup}
      setIsSignup={setIsSignup}
      error={error}
    />
  );
};

export default SigninContainer;
