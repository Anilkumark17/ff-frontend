import { getProjectByIdAPI, sendInviteAPI } from "../api/projectAPi";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Project = () => {
  const { id } = useParams(); // extracting project ID from URL params
  const location = useLocation();

  // tells us if this project was opened from invited projects
  const isInvited = location.state?.isInvited === true;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        console.log("[Project Page] Fetching project:", id);
        console.log("[Project Page] isInvited:", isInvited);

        const res = await getProjectByIdAPI({ id, token });
        setProject(res.data);
      } catch (err) {
        console.error("[Project Page] Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, isInvited]);

  if (loading) return <p>Loading...</p>;
  if (!project) return <p>Project not found</p>;

  // Invite handler (ONLY for owned projects)
  const handleInvite = async () => {
    if (!email) return;

    try {
      setInviting(true);
      const token = localStorage.getItem("token");

      await sendInviteAPI({
        projectId: id,
        email,
        token,
      });

      setEmail("");
    } catch (err) {
      console.error("[Invite] Failed:", err.response?.data || err.message);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      {/* ================= PROJECT DETAILS ================= */}
      <h1>{project.name}</h1>

      <p>
        <strong>Client:</strong> {project.client_name}
      </p>

      {isInvited && (
        <p style={{ color: "#4f46e5", fontSize: "14px" }}>
          You are an invited collaborator on this project
        </p>
      )}

      <hr style={{ margin: "24px 0" }} />

      {/* ================= ADD CONTRIBUTOR ================= */}
      {/* IMPORTANT:
          This section is NEVER rendered for invited projects.
          No text, no input, no divider — nothing.
      */}
      {!isInvited && (
        <div>
          <h3>Add Contributor</h3>

          <input
            type="email"
            placeholder="Enter contributor email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "8px", width: "260px", marginRight: "8px" }}
          />

          <button onClick={handleInvite} disabled={inviting}>
            {inviting ? "Sending..." : "Send Invite"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Project;
