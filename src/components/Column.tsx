import React, { useState } from "react";
import { Task as TaskComponent } from "./Task";
import { Task as TaskType } from "../types";
import { useBoards } from "../context/BoardContext";
import { Plus, MoreVertical } from "lucide-react";

interface ColumnProps {
	id: string;
	boardId: string;
	title: string;
	tasks: TaskType[];
}

// column

export const Column: React.FC<ColumnProps> = ({ id, boardId, title, tasks }) => {
	const { editColumn, deleteColumn, createTask, moveTask } = useBoards();
	const [isEditing, setIsEditing] = useState(false);
	const [newTitle, setNewTitle] = useState(title);
	const [showMenu, setShowMenu] = useState(false);
	const [showAddTask, setShowAddTask] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");

	const handleRename = () => {
		if (newTitle.trim() && newTitle !== title) {
			editColumn(boardId, id, newTitle);
		}
		setIsEditing(false);
	};

	const handleAddTask = () => {
		if (newTaskTitle.trim()) {
			createTask(id, newTaskTitle, newTaskDescription);
			setNewTaskTitle("");
			setNewTaskDescription("");
			setShowAddTask(false);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const taskId = e.dataTransfer.getData("taskId");
		const sourceColumnId = e.dataTransfer.getData("columnId");

		if (sourceColumnId !== id) {
			moveTask(taskId, sourceColumnId, id, 0);
		}
	};

	return (
		<div
			className="flex-shrink-0 w-80 bg-black rounded-lg p-4 border border-gray-700"
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<div className="flex items-center justify-between mb-4">
				{isEditing ? (
					<input
						type="text"
						value={newTitle}
						onChange={(e) => setNewTitle(e.target.value)}
						onBlur={handleRename}
						onKeyPress={(e) => e.key === "Enter" && handleRename()}
						className="font-semibold bg-black border-none rounded text-white focus:ring-[#5FA8D3]"
						autoFocus
					/>
				) : (
					<h3
						className="font-semibold cursor-pointer text-white hover:text-[#5FA8D3]"
						onClick={() => setIsEditing(true)}
					>
						{title}
					</h3>
				)}

				<div className="relative">
					<button
						onClick={() => setShowMenu(!showMenu)}
						className="p-1 hover:bg-black rounded text-gray-300"
					>
						<MoreVertical size={20} />
					</button>

					{showMenu && (
						<div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg z-10 border border-gray-700">
							<button
								onClick={() => {
									deleteColumn(boardId, id);
									setShowMenu(false);
								}}
								className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-black"
							>
								Delete Column
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="space-y-2">
				{tasks.map((task) => (
					<TaskComponent
						key={task.id}
						{...task}
						columnId={id}
					/>
				))}
			</div>

			{showAddTask ? (
				<div className="mt-4 p-3 bg-black border border-cyan-400 rounded-md">
					<input
						type="text"
						value={newTaskTitle}
						onChange={(e) => setNewTaskTitle(e.target.value)}
						placeholder="Enter task title"
						className="w-full mb-2 px-2 py-1 bg-gray-600 border-gray-500 rounded text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3]"
					/>
					<textarea
						value={newTaskDescription}
						onChange={(e) => setNewTaskDescription(e.target.value)}
						placeholder="Enter task description"
						className="w-full mb-2 px-2 py-1 bg-gray-600 border-gray-500 rounded text-white placeholder-gray-400 focus:border-[#5FA8D3] focus:ring-[#5FA8D3]"
						rows={3}
					/>
					<div className="flex justify-end gap-2">
						<button
							onClick={() => setShowAddTask(false)}
							className="px-3 py-1 text-gray-300 hover:text-white"
						>
							Cancel
						</button>
						<button
							onClick={handleAddTask}
							className="px-3 py-1 bg-cyan-400 text-white rounded hover:bg-cyan-600 transition-colors"
						>
							Add
						</button>
					</div>
				</div>
			) : (
				<button
					onClick={() => setShowAddTask(true)}
					className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-300 hover:bg-black rounded transition-colors"
				>
					<Plus size={20} />
					Add Task
				</button>
			)}
		</div>
	);
};
