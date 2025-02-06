import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "../types";

interface AuthContextType extends AuthState {
	login: (email: string, password: string) => boolean;
	register: (email: string, password: string, name: string) => boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
	});

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			setAuthState({
				user: JSON.parse(user),
				isAuthenticated: true,
			});
		}
	}, []);

	const login = (email: string, password: string): boolean => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const user = users.find((u: User) => u.email === email && u.password === password);

		if (user) {
			setAuthState({ user, isAuthenticated: true });
			localStorage.setItem("user", JSON.stringify(user));
			return true;
		}
		return false;
	};

	const register = (email: string, password: string, name: string): boolean => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");

		if (users.some((u: User) => u.email === email)) {
			return false;
		}

		const newUser: User = {
			id: crypto.randomUUID(),
			email,
			password,
			name,
		};

		users.push(newUser);
		localStorage.setItem("users", JSON.stringify(users));

		setAuthState({ user: newUser, isAuthenticated: true });
		localStorage.setItem("user", JSON.stringify(newUser));
		return true;
	};

	const logout = () => {
		setAuthState({ user: null, isAuthenticated: false });
		localStorage.removeItem("user");
	};

	return <AuthContext.Provider value={{ ...authState, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
