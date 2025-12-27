import axios from "axios";

// Fetch single project by ID
export const getProjectByIdAPI = async ({ id, token }) => {
  const res = await axios.get(
    `http://localhost:5000/api/projects/${id}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


// Send invite to project
export const sendInviteAPI = async ({ projectId, email, token }) => {
  const res = await axios.post(
    `http://localhost:5000/api/projects/${projectId}/sendinvite`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

