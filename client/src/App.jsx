import {
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import VerifyOTP from "./pages/VerifyOTP";
import CompleteRegister from "./pages/CompleteRegister";
import CompleteLogin from "./pages/CompleteLogin";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/verify-otp"
        element={<VerifyOTP />}
      />

      <Route
        path="/complete-register"
        element={<CompleteRegister />}
      />

      <Route
        path="/complete-login"
        element={<CompleteLogin />}
      />

      <Route
        path="/profile/:id"
        element={<Profile />}
      />

    </Routes>

  )

}

export default App