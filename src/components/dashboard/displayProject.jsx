import { useNavigate } from "react-router-dom";
import "./dashboard.css";

// Project Card (Dashboard)
// Used for both Owned Projects and Invited Projects

const DisplayProject = ({ project, onEdit, onDelete, isInvited = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("[Project Card] Navigating to project:", project.id);

    navigate(`/projects/${project.id}`, {
      state: { isInvited }, // tells Project page if this is invited or owned
    });
  };

  return (
    <div className="project-card" onClick={handleCardClick}>
      <div className="card-header">
        <h3>{project.name}</h3>
      </div>

      <p className="card-desc">{project.description}</p>

      {/* Client name may not exist for invited projects */}
      {project.client_name && (
        <p className="client-text">
          <strong>Client:</strong> {project.client_name}
        </p>
      )}

      {/* Action buttons */}
      <div className="card-actions">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Stop click bubbling to card
              onEdit(project);
            }}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            className="danger"
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation
              onDelete(project.id);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DisplayProject;
