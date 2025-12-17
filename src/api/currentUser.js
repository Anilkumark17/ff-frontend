import axios from "axios";
export const currentUser = async ({ token }) => {
  try {
    const response = await axios.get("http://localhost:5000/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};
