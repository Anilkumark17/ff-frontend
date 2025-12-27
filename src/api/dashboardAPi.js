import axios from "axios";

const BASE_URL = "http://localhost:5000/api/dashboard";
const INVITED_URL = "http://localhost:5000/api/invitedprojects";

// Create new project
export const createProjectAPI = async ({project, token}) => {
  const response = await axios.post(BASE_URL, project, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch all projects
export const getProjectsAPI = async ({token}) => {
  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update existing project
export const updateProjectAPI = async ({id, updatedData, token}) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a project
export const deleteProjectAPI = async ({id, token}) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// invited projects
export const getInvitedProjectsAPI = async ({ token }) => {
  const res = await axios.get(INVITED_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};