import React, { useState } from "react";
import { useBoards } from "../context/BoardContext";
import { useAuth } from "../context/AuthContext";
import { Board } from "./Board";
import { Plus, LogOut } from "lucide-react";
// dashboard pages
export const Dashboard: React.FC = () => {
	const { boards, createBoard } = useBoards();
	const { logout } = useAuth();
	const [showCreateBoard, setShowCreateBoard] = useState(false);
	const [newBoardTitle, setNewBoardTitle] = useState("");

	const handleCreateBoard = () => {
		if (newBoardTitle.trim()) {
			createBoard(newBoardTitle);
			setNewBoardTitle("");
			setShowCreateBoard(false);
		}
	};

	return (
		<div className="min-h-screen bg-black">
			<header className="bg-black sticky top-0 border-b z-20 border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center  justify-between">
						<h1 className="text-2xl font-bold text-white">My Boards</h1>
						<div className="flex items-center gap-4">
							<button
								onClick={() => setShowCreateBoard(true)}
								className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-600 transition-colors"
							>
								<Plus size={20} />
								New Board
							</button>
							<button
								onClick={logout}
								className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
							>
								<LogOut size={20} />
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{boards.length === 0 ? (
					<div className="text-center py-12">
						<h2 className="text-xl text-white">No boards yet</h2>
						<p className="mt-2 text-gray-400">Create your first board to get started</p>
					</div>
				) : (
					<div className="space-y-8">
						{boards.map((board) => (
							<Board
								key={board.id}
								{...board}
							/>
						))}
					</div>
				)}
			</main>

			{showCreateBoard && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
					<div className="bg-black p-6 rounded-lg w-96 border border-gray-700">
						<h3 className="text-xl font-bold mb-4 text-white">Create New Board</h3>
						<input
							type="text"
							value={newBoardTitle}
							onChange={(e) => setNewBoardTitle(e.target.value)}
							placeholder="Enter board title"
							className="w-full px-3 py-2 bg-black border border-cyan-400 rounded-md mb-4 text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3] "
						/>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setShowCreateBoard(false)}
								className="px-4 py-2 text-gray-300 hover:text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleCreateBoard}
								className="px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-600 transition-colors"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
