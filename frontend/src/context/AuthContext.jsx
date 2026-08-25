import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลด user จาก localStorage ตอนเปิดเว็บ
  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error(
        "โหลดข้อมูล user ไม่สำเร็จ:",
        error
      );

      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = (userData) => {
    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };

  // Logout
  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");

    // Cookie auth_token ต้องให้ Backend เป็นคนลบ
    // ดังนั้นเรียก API logout ตรงนี้
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth ต้องใช้ภายใน AuthProvider"
    );
  }

  return context;
}