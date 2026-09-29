import { createContext, useContext, useEffect, useState } from "react";
import { api, apiErr } from "@/lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined=loading, null=guest

  useEffect(() => {
    const token = localStorage.getItem("jc_token");
    if (!token) { setUser(null); return; }
    api.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => { localStorage.removeItem("jc_token"); setUser(null); });
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("jc_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("jc_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, apiErr }}>
      {children}
    </AuthContext.Provider>
  );
};
