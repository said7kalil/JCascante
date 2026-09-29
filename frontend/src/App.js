import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CasePresentation from "@/pages/CasePresentation";

const Protected = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined)
    return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white/70 font-body">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/caso/:id" element={<Protected><CasePresentation /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors theme="dark" />
      </AuthProvider>
    </div>
  );
}

export default App;
