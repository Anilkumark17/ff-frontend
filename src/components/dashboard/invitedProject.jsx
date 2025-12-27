import { useNavigate } from "react-router-dom";
import "./dashboard.css";

// Invited Project Card (Dashboard)

const InvitedProject = ({ project }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("[Invited Project] Navigating to project:", project.id);

    navigate(`/projects/${project.id}`, {
      state: { isInvited: true }, // explicitly mark invited project
    });
  };

  return (
    <div className="project-card invited" onClick={handleCardClick}>
      <div className="card-header">
        <h3>{project.name}</h3>
      </div>

      <p className="card-desc">{project.description}</p>

      <p className="invite-badge">Invited</p>
    </div>
  );
};

export default InvitedProject;
