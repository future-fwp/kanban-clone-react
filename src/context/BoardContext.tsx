import React, { createContext, useContext, useState, useEffect } from "react";
import { Board, Column, Task } from "../types";
import { useAuth } from "./AuthContext";

interface BoardContextType {
	boards: Board[];
	createBoard: (title: string) => void;
	deleteBoard: (boardId: string) => void;
	renameBoard: (boardId: string, newTitle: string) => void;
	addMember: (boardId: string, email: string) => boolean;
	createColumn: (boardId: string, title: string) => void;
	deleteColumn: (boardId: string, columnId: string) => void;
	editColumn: (boardId: string, columnId: string, newTitle: string) => void;
	createTask: (columnId: string, title: string, description: string) => void;
	deleteTask: (columnId: string, taskId: string) => void;
	editTask: (task: Task) => void;
	moveTask: (taskId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => void;
	assignTask: (taskId: string, columnId: string, userId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [boards, setBoards] = useState<Board[]>([]);
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			const savedBoards = JSON.parse(localStorage.getItem("boards") || "[]");
			setBoards(savedBoards);
		}
	}, [user]);

	useEffect(() => {
		if (boards.length > 0) {
			localStorage.setItem("boards", JSON.stringify(boards));
		}
	}, [boards]);

	const createBoard = (title: string) => {
		if (!user) return;

		const newBoard: Board = {
			id: crypto.randomUUID(),
			title,
			ownerId: user.id,
			members: [user.id],
			columns: [],
			createdAt: new Date().toISOString(),
		};

		setBoards([...boards, newBoard]);
	};

	const deleteBoard = (boardId: string) => {
		setBoards(boards.filter((board) => board.id !== boardId));
	};

	const renameBoard = (boardId: string, newTitle: string) => {
		setBoards(boards.map((board) => (board.id === boardId ? { ...board, title: newTitle } : board)));
	};

	const addMember = (boardId: string, email: string): boolean => {
		const users = JSON.parse(localStorage.getItem("users") || "[]");
		const userToAdd = users.find((u: { email: string }) => u.email === email);

		if (!userToAdd) return false;

		setBoards(
			boards.map((board) => {
				if (board.id === boardId && !board.members.includes(userToAdd.id)) {
					return { ...board, members: [...board.members, userToAdd.id] };
				}
				return board;
			})
		);

		return true;
	};

	const createColumn = (boardId: string, title: string) => {
		const newColumn: Column = {
			id: crypto.randomUUID(),
			title,
			boardId,
			tasks: [],
		};

		setBoards(
			boards.map((board) => (board.id === boardId ? { ...board, columns: [...board.columns, newColumn] } : board))
		);
	};

	const deleteColumn = (boardId: string, columnId: string) => {
		setBoards(
			boards.map((board) =>
				board.id === boardId ? { ...board, columns: board.columns.filter((col) => col.id !== columnId) } : board
			)
		);
	};

	const editColumn = (boardId: string, columnId: string, newTitle: string) => {
		setBoards(
			boards.map((board) =>
				board.id === boardId
					? {
							...board,
							columns: board.columns.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)),
					  }
					: board
			)
		);
	};

	const createTask = (columnId: string, title: string, description: string) => {
		const newTask: Task = {
			id: crypto.randomUUID(),
			title,
			description,
			assignees: [],
			columnId,
			position: 0,
			createdAt: new Date().toISOString(),
		};

		setBoards(
			boards.map((board) => ({
				...board,
				columns: board.columns.map((col) => {
					if (col.id === columnId) {
						const tasks = [...col.tasks];
						tasks.forEach((task) => task.position++);
						return { ...col, tasks: [newTask, ...tasks] };
					}
					return col;
				}),
			}))
		);
	};

	const deleteTask = (columnId: string, taskId: string) => {
		setBoards(
			boards.map((board) => ({
				...board,
				columns: board.columns.map((col) =>
					col.id === columnId ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) } : col
				),
			}))
		);
	};

	const editTask = (updatedTask: Task) => {
		setBoards(
			boards.map((board) => ({
				...board,
				columns: board.columns.map((col) =>
					col.id === updatedTask.columnId
						? { ...col, tasks: col.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)) }
						: col
				),
			}))
		);
	};

	const moveTask = (taskId: string, sourceColumnId: string, targetColumnId: string, newPosition: number) => {
		setBoards(
			boards.map((board) => {
				const updatedColumns = board.columns.map((col) => {
					if (col.id === sourceColumnId) {
						return { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) };
					}
					if (col.id === targetColumnId) {
						const task = board.columns.find((c) => c.id === sourceColumnId)?.tasks.find((t) => t.id === taskId);

						if (task) {
							const updatedTask = { ...task, columnId: targetColumnId, position: newPosition };
							const tasks = [...col.tasks];
							tasks.splice(newPosition, 0, updatedTask);
							return { ...col, tasks };
						}
					}
					return col;
				});

				return { ...board, columns: updatedColumns };
			})
		);
	};

	const assignTask = (taskId: string, columnId: string, userId: string) => {
		setBoards(
			boards.map((board) => ({
				...board,
				columns: board.columns.map((col) =>
					col.id === columnId
						? {
								...col,
								tasks: col.tasks.map((task) =>
									task.id === taskId
										? {
												...task,
												assignees: task.assignees.includes(userId)
													? task.assignees.filter((id) => id !== userId)
													: [...task.assignees, userId],
										  }
										: task
								),
						  }
						: col
				),
			}))
		);
	};

	return (
		<BoardContext.Provider
			value={{
				boards,
				createBoard,
				deleteBoard,
				renameBoard,
				addMember,
				createColumn,
				deleteColumn,
				editColumn,
				createTask,
				deleteTask,
				editTask,
				moveTask,
				assignTask,
			}}
		>
			{children}
		</BoardContext.Provider>
	);
};

export const useBoards = () => {
	const context = useContext(BoardContext);
	if (!context) {
		throw new Error("useBoards must be used within a BoardProvider");
	}
	return context;
};
