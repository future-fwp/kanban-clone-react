import React, { useState } from "react";
import { useBoards } from "../context/BoardContext";
import { MoreVertical, User } from "lucide-react";

interface TaskProps {
	id: string;
	title: string;
	description: string;
	columnId: string;
	assignees: string[];
}

export const Task: React.FC<TaskProps> = ({ id, title, description, columnId, assignees }) => {
	const { deleteTask, editTask } = useBoards();
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(title);
	const [newDescription, setNewDescription] = useState(description);
	const [showMenu, setShowMenu] = useState(false);

	const handleEdit = () => {
		if (newTitle.trim()) {
			editTask({
				id,
				title: newTitle,
				description: newDescription,
				columnId,
				assignees,
				position: 0,
				createdAt: new Date().toISOString(),
			});
			setIsEditing(false);
		}
	};

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("taskId", id);
		e.dataTransfer.setData("columnId", columnId);
	};

	return (
		<div
			className="bg-black p-3 rounded-md shadow-md cursor-pointer hover:shadow-lg transition-shadow border border-gray-600"
			draggable
			onDragStart={handleDragStart}
		>
			{isEditing ? (
				<div className="space-y-2">
					<input
						type="text"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						className="w-full px-2 py-1 bg-gray-600 border-gray-500 rounded text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3]"
						autoFocus
					/>
					<textarea
						value={newDescription}
						onChange={(e) => setNewDescription(e.target.value)}
						className="w-full px-2 py-1 bg-gray-600 border-gray-500 rounded text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3]"
						rows={3}
					/>
					<div className="flex justify-end gap-2">
						<button
							onClick={() => setIsEditing(false)}
							className="px-3 py-1 text-gray-300 hover:text-white"
						>
							Cancel
						</button>
						<button
							onClick={handleEdit}
							className="px-3 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-600 transition-colors"
						>
							Save
						</button>
					</div>
				</div>
			) : (
				<div>
					<div className="flex items-start justify-between">
						<h4 className="font-medium text-white">{title}</h4>
						<div className="relative">
							<button
								onClick={() => setShowMenu(!showMenu)}
								className="p-1 hover:bg-gray-600 rounded text-gray-300 absolute z-10 right-0 top-0"
							>
								<MoreVertical size={16} />
							</button>

							{showMenu && (
								<div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg z-10 border border-gray-700">
									<button
										onClick={() => {
											setIsEditing(true);
											setShowMenu(false);
										}}
										className="w-full text-left px-4 py-2 text-sm text-white hover:bg-black"
									>
										Edit Task
									</button>
									<button
										onClick={() => {
											deleteTask(columnId, id);
											setShowMenu(false);
										}}
										className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-black"
									>
										Delete Task
									</button>
								</div>
							)}
						</div>
					</div>

					{description && <p className="mt-2 text-sm text-gray-300">{description}</p>}

					{assignees.length > 0 && (
						<div className="mt-3 flex items-center gap-1 text-[#5FA8D3]">
							<User size={16} />
							<span className="text-sm">{assignees.length} assigned</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
