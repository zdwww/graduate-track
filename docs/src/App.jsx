import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PublicRoute from "./components/PublicRoutes";

import { routerPaths } from "./helpers/constants/routes";
import { AuthProvider } from "./helpers/context/AuthProvider";
import PrivateRoute from "./components/PrivateRoutes";
import ProgramsPage from "./pages/ProgramsPage";
import SignupPage from "./pages/SignupPage";

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
            path={routerPaths.application}
            element={<PrivateRoute component={<ProgramsPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
