import axios from "axios";

// UPLOAD ASSET + PRD 
export const uploadAssetAPI = async ({ formData, token }) => {
  console.log("[Asset API] Uploading asset");

  const res = await axios.post(
    "http://localhost:5000/api/assets/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// FETCH PROJECT ASSETS
export const getAssetsAPI = async ({ projectId, token }) => {
  const res = await axios.get(
    `http://localhost:5000/api/assets/${projectId}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
