import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Auth: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");

	const { login, register } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (isLogin) {
			const success = login(email, password);
			if (!success) {
				setError("Invalid email or password");
			}
		} else {
			if (!name) {
				setError("Name is required");
				return;
			}
			const success = register(email, password, name);
			if (!success) {
				setError("Email already exists");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-black">
			<div className="bg-black p-8 rounded-lg shadow-xl w-96 border border-gray-700">
				<h2 className="text-2xl font-bold mb-6 text-center text-[#5FA8D3]">{isLogin ? "Login" : "Register"}</h2>

				<form
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					{!isLogin && (
						<div>
							<label className="block text-sm font-medium text-white">Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="mt-1 block w-full rounded-md bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3] px-3 py-2"
								required
							/>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-white">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="mt-1 block w-full rounded-md bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3] px-3 py-2"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-white">Password</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="mt-1 block w-full rounded-md bg-black border-gray-600 text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3] px-3 py-2"
							required
						/>
					</div>

					{error && <p className="text-red-400 text-sm">{error}</p>}

					<button
						type="submit"
						className="w-full bg-cyan-400 text-white py-2 px-4 rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-[#5FA8D3] focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
					>
						{isLogin ? "Login" : "Register"}
					</button>
				</form>

				<p className="mt-4 text-center text-sm text-gray-300">
					{isLogin ? "Don't have an account? " : "Already have an account? "}
					<button
						onClick={() => setIsLogin(!isLogin)}
						className="text-[#5FA8D3] hover:text-[#006494] font-medium"
					>
						{isLogin ? "Register" : "Login"}
					</button>
				</p>
			</div>
		</div>
	);
};
