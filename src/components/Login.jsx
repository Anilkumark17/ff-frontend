import "../styles/SignIn.css";
import logo from "../landingpage/Main_logo.png";
import { useNavigate } from "react-router-dom";

const Login = ({
  email,
  password,
  onChange,
  onSubmit,
  error,
}) => {
    const navigate = useNavigate();
    
  return (
    <div className="signin-wrapper">
      <div className="signin-card">
        <div className="signin-logo">
          <img src={logo} alt="FeedForward" />
          
        </div>

        <h2 className="signin-title">
          Welcome to FeedForward !
        </h2>

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
            placeholder="**********"
          />
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginTop: "10px" }}>
            {error}
          </p>
        )}

        <button className="signin-btn" onClick={onSubmit}>
          Login
        </button>

        <p className="signin-footer">
          Don’t have an account? 
          <span
           onClick={() => navigate("/signin")}
          style={{ cursor: "pointer" }}
          >
           signin
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
