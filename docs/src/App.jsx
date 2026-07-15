import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PublicRoute from "./components/PublicRoutes";
import PrivateRoute from "./components/PrivateRoutes";
import SignupPage from "./pages/SignupPage";
import SchoolsPage from "./pages/SchoolsPage";

import { routerPaths } from "./helpers/constants/routes";
import { AuthProvider } from "./helpers/context/AuthProvider";
import SchoolPage from "./pages/SchoolPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
