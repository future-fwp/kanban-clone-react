import React, { useState } from "react";
import { useBoards } from "../context/BoardContext";
import { Column as ColumnType } from "../types";
import { Column } from "./Column";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BoardProps {
	id: string;
	title: string;
	columns: ColumnType[];
}

export const Board: React.FC<BoardProps> = ({ id, title, columns }) => {
	const { createColumn, renameBoard, addMember } = useBoards();
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(title);
	const [newColumnTitle, setNewColumnTitle] = useState("");
	const [showAddColumn, setShowAddColumn] = useState(false);
	const [showInvite, setShowInvite] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [error, setError] = useState("");

	const handleRename = () => {
		if (newTitle.trim() && newTitle !== title) {
			renameBoard(id, newTitle);
		}
		setIsEditing(false);
	};

	const handleAddColumn = () => {
		if (newColumnTitle.trim()) {
			createColumn(id, newColumnTitle);
			setNewColumnTitle("");
			setShowAddColumn(false);
		}
	};

	const handleInvite = () => {
		if (inviteEmail.trim()) {
			const success = addMember(id, inviteEmail);

			if (success) {
				const notify = () => toast.success(`Invite ${inviteEmail} to board ${title}`);
				notify();
				setInviteEmail("");
				setShowInvite(false);
				setError("");
			} else {
				setError("User not found");
			}
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	return (
		<div className="p-6 bg-black rounded-lg border border-gray-700">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-4">
					{isEditing ? (
						<input
							type="text"
							value={newTitle}
							onChange={(e) => setNewTitle(e.target.value)}
							onBlur={handleRename}
							onKeyPress={(e) => e.key === "Enter" && handleRename()}
							className="text-2xl font-bold bg-black border-none rounded text-white focus:ring-[#5FA8D3]"
							autoFocus
						/>
					) : (
						<h2
							className="text-2xl font-bold cursor-pointer text-white hover:text-[#5FA8D3]"
							onClick={() => setIsEditing(true)}
						>
							{title}
						</h2>
					)}

					<button
						onClick={() => setShowInvite(true)}
						className="px-3 py-1 text-sm bg-cyan-400 text-white rounded-md hover:bg-cyan-600 transition-colors"
					>
						Invite
					</button>
				</div>

				<button
					onClick={() => setShowAddColumn(true)}
					className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-600 transition-colors"
				>
					<Plus size={20} />
					Add Column
				</button>
			</div>

			{showInvite && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
					<div className="bg-black p-6 rounded-lg w-96 border border-gray-700">
						<h3 className="text-xl font-bold mb-4 text-white">Invite Member</h3>
						<input
							type="email"
							value={inviteEmail}
							onChange={(e) => setInviteEmail(e.target.value)}
							placeholder="Enter email address"
							className="w-full px-3 py-2 bg-black border border-cyan-400 rounded-md mb-4 text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3] "
						/>
						{error && <p className="text-red-400 text-sm mb-4">{error}</p>}
						<div className="flex justify-end gap-2">
							<button
								onClick={() => {
									setShowInvite(false);
									setError("");
								}}
								className="px-4 py-2 text-gray-300 hover:text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleInvite}
								className="px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-600 transition-colors"
							>
								Invite
							</button>
						</div>
					</div>
				</div>
			)}

			{showAddColumn && (
				<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
					<div className="bg-black p-6 rounded-lg w-96 border border-gray-700">
						<h3 className="text-xl font-bold mb-4 text-white">Add Column</h3>
						<input
							type="text"
							value={newColumnTitle}
							onChange={(e) => setNewColumnTitle(e.target.value)}
							placeholder="Enter column title"
							className="w-full px-3 py-2 bg-black border border-cyan-400 rounded-md mb-4 text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3]"
						/>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setShowAddColumn(false)}
								className="px-4 py-2 text-gray-300 hover:text-white"
							>
								Cancel
							</button>
							<button
								onClick={handleAddColumn}
								className="px-4 py-2 bg-cyan-400 text-white rounded-md hover:bg-cyan-600 transition-colors"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			)}

			<div
				className="flex gap-6 overflow-x-auto pb-6"
				onDragOver={handleDragOver}
			>
				{columns.map((column) => (
					<Column
						key={column.id}
						// boardId={id}
						{...column}
					/>
				))}
			</div>
		</div>
	);
};
