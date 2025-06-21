import {
  Routes,
  Route,
} from "react-router-dom";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
