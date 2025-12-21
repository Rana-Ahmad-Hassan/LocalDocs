import NavBar from "./components/ui/shared/NavBar";
import { AppRoutes } from "./routes";

function App() {
  return (
    <div>
      <div className="mx-6">
        <NavBar />
      </div>
      <div style={{ maxWidth: 1200, margin: "auto" }}>
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
