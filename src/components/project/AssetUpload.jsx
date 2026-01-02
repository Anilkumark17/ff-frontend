import { useState } from "react";
import { uploadAssetAPI } from "../../api/assetAPi";

const AssetUpload = ({
  projectId,
  assets = [],
  onUploadSuccess,
  isInvited,
}) => {
  const [prdFile, setPrdFile] = useState(null);
  const [prdName, setPrdName] = useState("");

  const [assetFile, setAssetFile] = useState(null);
  const [assetName, setAssetName] = useState("");

  const [uploading, setUploading] = useState(false);

  const upload = async (file, name) => {
    if (!file || !name) return;

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("filename", name);
      formData.append("project_id", projectId);
      formData.append("file", file);

      console.log("[Upload]", name, file.name);

      await uploadAssetAPI({ formData, token });

      onUploadSuccess?.();
    } catch (err) {
      console.error("[Upload Failed]", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="asset-list-section">
      {/* PRD UPLOAD */}
      {!isInvited && (
        <div className="upload-section">
          <h3>Upload PRD</h3>

          <div className="upload-form">
            <input
              type="text"
              placeholder="PRD name"
              value={prdName}
              onChange={(e) => setPrdName(e.target.value)}
              className="upload-input"
            />

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setPrdFile(e.target.files[0])}
              className="upload-file-input"
            />

            <button
              disabled={uploading}
              onClick={() => {
                upload(prdFile, prdName);
                setPrdFile(null);
                setPrdName("");
              }}
              className="upload-btn"
            >
              Upload PRD
            </button>
          </div>
        </div>
      )}

      {/* ASSET UPLOAD */}
      {!isInvited && (
        <div className="upload-section">
          <h3>Upload Asset (Image / Video)</h3>

          <div className="upload-form">
            <input
              type="text"
              placeholder="Asset name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="upload-input"
            />

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setAssetFile(e.target.files[0])}
              className="upload-file-input"
            />

            <button
              disabled={uploading}
              onClick={() => {
                upload(assetFile, assetName);
                setAssetFile(null);
                setAssetName("");
              }}
              className="upload-btn"
            >
              Upload Asset
            </button>
          </div>
        </div>
      )}

      {/* ASSET LIST */}
      <h3 className="asset-list-title">Uploaded Files</h3>

      {assets.length === 0 && <p className="asset-list-empty">No files uploaded yet</p>}

      <ul className="asset-list">
        {assets.map((asset) => (
          <li key={asset.id} className="asset-item">
            <div className="asset-item-content">
              <strong className="asset-item-title">{asset.title}</strong>
              <span className="asset-item-type">({asset.type})</span>
            </div>
            <a
              href={asset.file_url}
              download
              target="_blank"
              rel="noreferrer"
              className="asset-download-link"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetUpload;

