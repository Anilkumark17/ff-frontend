import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import LogOut from "../components/LogOut";

import {
  getProjectsAPI,
  deleteProjectAPI,
  getInvitedProjectsAPI,
} from "../api/dashboardAPi";

import CreateProject from "../components/dashboard/createProject";
import DisplayProject from "../components/dashboard/displayProject";

import "../components/dashboard/dashboard.css";

const FFDashboard = () => {
  const { user } = useCurrentUser();

  const [projects, setProjects] = useState([]);
  const [invitedProjects, setInvitedProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getProjectsAPI({ token });
      setProjects(res?.data ?? []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchInvitedProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getInvitedProjectsAPI({ token });

      // Backend returns nested structure -> extract projects
      const flattened = res.data.map((item) => item.projects);
      setInvitedProjects(flattened);
    } catch (err) {
      console.error("Failed to fetch invited projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchInvitedProjects();
  }, []);

  if (!user) return <p>No user found</p>;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          Create new project
        </button>
      </header>

      <p className="sub-text">
        Hey {user.email}, here is your project overview
      </p>

      {/* ================= OWNED PROJECTS ================= */}
      <h2 className="section-title">Your Projects</h2>

      <div className="project-grid">
        {projects.map((p) => (
          <DisplayProject
            key={p.id}
            project={p}
            onEdit={(proj) => {
              setEditingProject(proj);
              setShowCreate(true);
            }}
            onDelete={async (id) => {
              const token = localStorage.getItem("token");
              await deleteProjectAPI({ id, token });
              fetchProjects();
            }}
          />
        ))}
      </div>

      {/* ================= INVITED PROJECTS ================= */}
      {invitedProjects.length > 0 && (
        <>
          <h2 className="section-title" style={{ marginTop: "40px" }}>
            Invited Projects
          </h2>

          <div className="project-grid">
            {invitedProjects.map((p) => (
              <DisplayProject
                key={p.id}
                project={p}
                isInvited={true} 
                onEdit={null}    // invited users cannot edit
                onDelete={null}  // invited users cannot delete
              />
            ))}
          </div>
        </>
      )}

      {showCreate && (
        <CreateProject
          editingProject={editingProject}
          onClose={() => {
            setShowCreate(false);
            setEditingProject(null);
          }}
          onSuccess={fetchProjects}
        />
      )}

      <LogOut />
    </div>
  );
};

export default FFDashboard;
