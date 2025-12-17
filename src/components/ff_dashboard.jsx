import { useCurrentUser } from "../hooks/useCurrentUser";
import LogOut from "./LogOut";
const FFDashboard = () => {
  const { user, loading, error } = useCurrentUser();
  console.log("FFDashboard rendered", { user, loading, error });
  if (loading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.name || user.user.email || 'User'}!</p>
        </div>
      )}
      <LogOut />
    </div>
  );
};

export default FFDashboard;
