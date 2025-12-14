import "../styles/SignIn.css";
import logo from "../landingpage/Main_logo.png";
import { useNavigate } from "react-router-dom";


const SignIn = ({
  name,
  email,
  password,
  onChange,
  onSubmit,
  isSignup,
  setIsSignup,
  error,
}) => {
  const navigate = useNavigate();

  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <div className="signin-logo">
          <img src={logo} alt="FeedForward" className="logo-image" />
          
        </div>

        <h2 className="signin-title">Welcome to FeedForward !</h2>

        <div className="signin-field">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Ram chandra"
          />
        </div>

        <div className="signin-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="ram@gmail.com"
          />
        </div>

        <div className="signin-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="***********"
          />
        </div>

        

        <button className="signin-btn" onClick={onSubmit}>
          Sign In
        </button>

        <p className="signin-footer">
          Already have an account?{" "}
          <span
           onClick={() => navigate("/login")}
          style={{ cursor: "pointer" }}
          >
           login
          </span>
        </p>

      </div>
    </div>
  );
};

export default SignIn;
