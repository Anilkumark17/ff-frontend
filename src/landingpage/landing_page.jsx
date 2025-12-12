import React from "react";
import "./landing_page.css";
import feedLogo from "./Main_logo.png";   
import heroImg from "./main_view_img.jpg";
import close_button from "./close_button.png";          

const Landing_page = () => {
  return (
    <div className="landing-container-main">
      <div className="closing">
        
      <img 
        src={close_button} 
        alt="floating button" 
        className="floating-btn"
      />
      </div>
      <div className="landing-container">

      
      <nav className="navbar">
        <div className="nav-left">
          <img src={feedLogo} alt="FeedForward Logo" className="logo" />
        </div>

        <div className="nav-right">
          <button className="btn-outline">Log In</button>
          <button className="btn-filled">Try for free</button>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Turn messy requests into clean tasks with FeedForward.
        </h1>

        <p className="hero-subtitle">
          Clients keep sending changes across chats, docs, and calls? Bring it all <br/>
          together with FeedForward — one platform that turns chaos into clarity.
        </p>

        <div className="hero-buttons">
          <button className="btn-filled_2">Try for free</button>
          <button className="btn-outline_2">Sign In</button>
        </div>
      </section>

      {/* Image Section */}
      <div className="image-wrapper">
        <img src={heroImg} alt="Workstation" className="hero-image" />
      </div>
      </div>
    </div>
    
  );
};

export default Landing_page;
