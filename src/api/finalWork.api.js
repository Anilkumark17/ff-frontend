import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Upload final work
export const uploadFinalWork = async (projectId, formData) => {
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/final/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all final outputs for a project
export const getFinalOutputs = async (projectId) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/final/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get single final output by ID
export const getFinalOutputById = async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/final/detail/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Add comment to final output
export const addComment = async (finalOutputId, comment, timestamp_seconds = null) => {
  const token = getAuthToken();
  const response = await axios.post(
    `${API_URL}/final/${finalOutputId}/comment`,
    { comment, timestamp_seconds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Get all comments for a final output
export const getComments = async (finalOutputId) => {
  const token = getAuthToken();
  const response = await axios.get(`${API_URL}/final/${finalOutputId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// PUBLIC API (No authentication required)

// Get public final output
export const getPublicFinalOutput = async (id) => {
  const response = await axios.get(`${API_URL}/public/final/${id}`);
  return response.data;
};

// Add public comment
export const addPublicComment = async (id, name, comment, timestamp_seconds = null) => {
  const response = await axios.post(`${API_URL}/public/final/${id}/comment`, {
    name,
    comment,
    timestamp_seconds,
  });
  return response.data;
};

// Get public comments
export const getPublicComments = async (id) => {
  const response = await axios.get(`${API_URL}/public/final/${id}/comments`);
  return response.data;
};
