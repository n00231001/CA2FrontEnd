import { createContext, useContext, useState } from "react";
import axios from "@/config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const onLogin = async (email, password) => {
    try {
      console.log("Login payload:", { email, password });
      const res = await axios.post("/login", { email, password }, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Login response:", res.data);

      // adjust to the shape your API returns (token / access_token)
      const token = res.data?.token || res.data?.access_token;
      if (!token) {
        throw new Error("Login response did not include a token");
      }

      // persist token and set default header for axios instance
      localStorage.setItem("token", token);
      axios.defaults.headers.common = axios.defaults.headers.common || {};
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      // set user if present
      setUser(res.data?.user || { email });
      return res.data;
    } catch (err) {
      console.error("onLogin error:", err?.response?.status, err?.response?.data || err.message);
      // normalize and throw a readable error message for callers
      const serverMsg = err?.response?.data?.message
        || err?.response?.data
        || err?.message
        || "Login failed";
      throw new Error(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    if (axios.defaults.headers.common) delete axios.defaults.headers.common.Authorization;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}