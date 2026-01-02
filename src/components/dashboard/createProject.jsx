import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createProjectAPI, updateProjectAPI } from "../../api/dashboardAPi";
import "./dashboard.css";

const CreateProject = ({ editingProject, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    projectName: editingProject?.name || "",
    clientName: editingProject?.client_name || "",
    description: editingProject?.description || "",
  });

  // Frontend-only (NOT sent to backend)
  const [startDate, setStartDate] = useState(
    editingProject?.startDate
      ? new Date(editingProject.startDate)
      : new Date() // default = today
  );

  const [endDate, setEndDate] = useState(
    editingProject?.deadline ? new Date(editingProject.deadline) : null
  );

  // Error state for validation
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (error) setError("");
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // Clear error when date changes
    if (error) setError("");
    // If end date is now before start date, clear it
    if (endDate && date && endDate < date) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    // Clear error when date changes
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================= DATE VALIDATION =================
    if (!startDate) {
      setError("Start date is required");
      return;
    }

    if (!endDate) {
      setError("End date is required");
      return;
    }

    // End date must be >= start date
    if (endDate < startDate) {
      setError("End date cannot be before start date");
      return;
    }

    // SEND ONLY WHAT BACKEND EXPECTS
    const payload = {
      name: formData.projectName,
      client_name: formData.clientName,
      description: formData.description,
      deadline: endDate,
    };

    try {
      const token = localStorage.getItem("token");
      if (editingProject) {
        await updateProjectAPI({
          id: editingProject.id,
          updatedData: payload,
          token,
        });
      } else {
        await createProjectAPI({
          project: payload,
          token,
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Save project failed:", err);
      setError("Failed to save project. Please try again.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="create-project-card">
        <h2>{editingProject ? "Edit Project" : "Create New Project"}</h2>

        <div className="field-row">
          <div>
            <label>Project Name</label>
            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Name of the Project"
            />
          </div>

          <div>
            <label>Client Name</label>
            <input
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Client Name"
            />
          </div>
        </div>

        <div className="field-row">
          <div>
            <label>Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              minDate={new Date()} // cannot pick past dates
              dateFormat="dd/MM/yy"
            />
          </div>

          <div>
            <label>End Date</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              minDate={startDate || new Date()} // cannot be before start date
              dateFormat="dd/MM/yy"
            />
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project description"
        />

        <div className="action-row">
          <button className="btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;

