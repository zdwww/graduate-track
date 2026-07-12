import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import PublicRoute from "./components/PublicRoutes";

import { routerPaths } from "./helpers/constants/routes";
import PrivateRoute from "./components/PrivateRoutes";
import ApplicationPage from "./pages/ApplicationPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
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
          element={<PrivateRoute component={<ApplicationPage />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
