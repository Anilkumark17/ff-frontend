import { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProjectByIdAPI, sendInviteAPI } from "../api/projectAPi";
import { getAssetsAPI } from "../api/assetAPi";
import AssetUpload from "../components/project/AssetUpload";
import "./project.css";

const Project = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // tells us if this project was opened from invited projects
  const isInvited = location.state?.isInvited === true;

  // ================= STATE =================
  const [project, setProject] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assets"); // Tab state
  // const [searchQuery, setSearchQuery] = useState(""); // Search state // Removed

  // Add contributor state
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  // ================= FETCH PROJECT + ASSETS =================
  const fetchProjectAndAssets = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("[Project Page] Fetching project:", id);
      console.log("[Project Page] isInvited:", isInvited);

      // ---- Fetch project (mandatory) ----
      const projectRes = await getProjectByIdAPI({ id, token });
      setProject(projectRes.data);

      // ---- Fetch assets (safe) ----
      try {
        const assetRes = await getAssetsAPI({ projectId: id, token });
        setAssets(assetRes?.data || []);
      } catch (assetErr) {
        console.warn("[Assets] Not found yet, continuing safely");
        setAssets([]);
      }
    } catch (err) {
      console.error("[Project Page] Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [id, isInvited]);

  // ================= EFFECT =================
  useEffect(() => {
    fetchProjectAndAssets();
  }, [fetchProjectAndAssets]);

  // ================= INVITE HANDLER =================
  const handleInvite = async () => {
    if (!email) return;

    try {
      setInviting(true);
      const token = localStorage.getItem("token");

      console.log("[Invite] Sending invite:", email);

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

  // ================= RENDER GUARDS =================
  if (loading) return <p className="loading-state">Loading...</p>;
  if (!project) return <p className="error-state">Project not found</p>;

  // ================= UI =================
  return (
    <div className="project-page-wrapper">
      {/* ================= PROJECT HEADER ================= */}
      <div className="project-header-bar">
        <div className="project-title-section">
          <button
            className="back-to-dashboard-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          <h1 className="project-title">{project.name}</h1>
        </div>

        {/* Add Contributor (only for owned projects) */}
        {!isInvited && (
          <div className="contributor-inline">
            <input
              type="email"
              placeholder="Enter contributor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="contributor-input-inline"
            />
            <button
              onClick={handleInvite}
              disabled={inviting}
              className="invite-btn"
            >
              {inviting ? "Sending..." : "Invite" }
            </button>
          </div>
        )}
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "assets" ? "active" : ""}`}
          onClick={() => setActiveTab("assets")}
        >
          <span className="tab-icon">📄</span>
          Assets
        </button>
        <button
          className={`tab-button ${activeTab === "final" ? "active" : ""}`}
          onClick={() => setActiveTab("final")}
        >
          <span className="tab-icon">🎯</span>
          Final
        </button>
        <button
          className={`tab-button ${activeTab === "track" ? "active" : ""}`}
          onClick={() => setActiveTab("track")}
        >
          <span className="tab-icon">📊</span>
          Track
        </button>
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="tab-content">
        {/* ASSETS TAB */}
        {activeTab === "assets" && (
          <div className="assets-tab">
            {/* Removed assets-toolbar */}
            <AssetUpload
              projectId={id}
              assets={assets}
              isInvited={isInvited}
              onUploadSuccess={fetchProjectAndAssets}
            // searchQuery={searchQuery} // Removed
            />
          </div>
        )}

        {/* FINAL TAB */}
        {activeTab === "final" && (
          <div className="final-tab">
            <div className="placeholder-content">
              <span className="placeholder-icon">🎯</span>
              <h3>Final Deliverables</h3>
              <p>Final project deliverables will appear here</p>
            </div>
          </div>
        )}

        {/* TRACK TAB */}
        {activeTab === "track" && (
          <div className="track-tab">
            <div className="placeholder-content">
              <span className="placeholder-icon">📊</span>
              <h3>Project Tracking</h3>
              <p>Project progress and tracking information will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;


