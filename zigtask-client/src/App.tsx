import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

function App() {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/" ||
    location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!hideHeader && <Header />}

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
