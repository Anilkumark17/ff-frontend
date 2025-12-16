import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Landing_page from "./landingpage/landing_page";
import SigninContainer from "./containers/SigninContainer";
import FFDashboard from "./components/ff_dashboard";
import LoginContainer from "./containers/LoginContainer";
import ProtectedRouter from "./routes/ProtectedRouter";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", 
        element: <Landing_page /> },

      { path: "/signin",    
        element: <SigninContainer /> },

      { path: "/dashboard",
       element: (
        <ProtectedRouter>
         <FFDashboard />
         </ProtectedRouter>
          )
      },

      
      {
        path: "/login",
        element: <LoginContainer />
      }
  
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
