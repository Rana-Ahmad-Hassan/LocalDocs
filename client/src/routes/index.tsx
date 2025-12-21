import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./services/protected";
import { publicRoutes } from "./services/publicRoutes";
import { protectedRoutes } from "./services/protectedRoutes";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Mapping */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}

        {/* Protected Mapping - WRAPPED IN A SINGLE PARENT */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
