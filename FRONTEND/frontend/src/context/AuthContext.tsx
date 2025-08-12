import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: number;
    email: string;
    role: "customer" | "mechanic" | "admin" | "manager";
    name: string; 

}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("authUser");
        const savedToken = localStorage.getItem("authToken");
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("authToken", token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
