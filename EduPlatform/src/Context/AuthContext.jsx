import React, { useState, useEffect } from "react";
import { UserContext } from "./Context";
import { getProfile } from "../Services/authService";

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    getProfile()
      .then((res) => {
        const data = res.data?.data;
        if (data) setUser({ id: data.id, name: data.name, email: data.email, profileImage: data.profileImage });
      })
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const updateUser = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, updateUser, logout, authLoading: loading }}>
      {children}
    </UserContext.Provider>
  );
}
