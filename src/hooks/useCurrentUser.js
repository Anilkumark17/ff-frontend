import { useState, useEffect } from "react";
import { currentUser } from "../api/currentUser";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        
        // If no token exists, don't make the API call
        if (!token) {
          setError("No authentication token found");
          setUser(null);
          setLoading(false);
          return;
        }
        
        const response = await currentUser({ token });
        // Backend returns { user: { ...supabaseUser } }
        // Extract the actual user object (not nested)
        const userData = response.user || response.data?.user || response;
        console.log("User data fetched:", userData);
        setUser(userData);
      } catch (err) {
        console.error("Error fetching current user:", err);
        
        // Distinguish between different error types
        if (err.response?.status === 401) {
          setError("Session expired or invalid. Please login again.");
          // Clear invalid token
          localStorage.removeItem("token");
        } else {
          setError(err.message || "Failed to fetch user data");
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []); 

  return { user, loading, error };
};