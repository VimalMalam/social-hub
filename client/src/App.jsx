import {
  Routes,
  Route
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";

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

  const { loading } = useAuth();

  if (loading) {

    return (

      <div className="h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold">

          Loading...

        </h1>

      </div>

    )

  }

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