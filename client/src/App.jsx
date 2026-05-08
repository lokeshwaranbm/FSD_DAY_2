import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};
export default App
