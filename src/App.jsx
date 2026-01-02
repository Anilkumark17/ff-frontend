import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Landing_page from "./landingpage/landing_page";
import SigninContainer from "./containers/SigninContainer";
import FFDashboard from "./pages/ff_dashboard";
import Project from "./pages/project";
import LoginContainer from "./containers/LoginContainer";
import ProtectedRouter from "./routes/ProtectedRouter";
import FinalWorkDetail from "./pages/FinalWorkDetail";
import PublicFinalView from "./pages/PublicFinalView";


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

      { path: "/projects/:id" ,
       element: (
        <ProtectedRouter>
         <Project />
         </ProtectedRouter>
          )
      },

      { path: "/final/:id",
       element: (
        <ProtectedRouter>
         <FinalWorkDetail />
         </ProtectedRouter>
          )
      },

      {
        path: "/login",
        element: <LoginContainer />
      },

      // Public route (no authentication required)
      { path: "/public/final/:id",
        element: <PublicFinalView />
      }
  
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
