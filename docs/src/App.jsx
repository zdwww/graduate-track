import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PublicRoute from "./components/PublicRoutes";
import PrivateRoute from "./components/PrivateRoutes";
import Navigation from "./components/Navigation";
import SignupPage from "./pages/SignupPage";
import SchoolsPage from "./pages/SchoolsPage";

import { routerPaths } from "./helpers/constants/routes";
import { AuthProvider } from "./helpers/context/AuthProvider";
import SchoolPage from "./pages/SchoolPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ApplicationEditPage from "./pages/ApplicationEditPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path={routerPaths.login}
            element={<PublicRoute component={<LoginPage />} />}
          />
          <Route
            path={routerPaths.signup}
            element={<PublicRoute component={<SignupPage />} />}
          />
          <Route
            path={routerPaths.schools}
            element={<PrivateRoute component={<SchoolsPage />} />}
          />
          <Route
            path={routerPaths.school}
            element={<PrivateRoute component={<SchoolPage />} />}
          />
          <Route
            path={routerPaths.applications}
            element={<PrivateRoute component={<ApplicationsPage />} />}
          />
          <Route
            path={routerPaths.applicationEdit}
            element={<PrivateRoute component={<ApplicationEditPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
