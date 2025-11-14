"use client";

import { Trash } from "lucide-react";
import EditTask from "./edit-task";
import { Task } from "@/generated/prisma";

interface TaskListProps {
  filteredTask: Task[];
  handleToggleTask: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  handlegetTasks: () => void;
}

export function TaskListContent({
  filteredTask,
  handleToggleTask,
  handleDeleteTask,
  handlegetTasks,
}: TaskListProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {filteredTask.length === 0 && (
        <p className="text-xs border-t py-4">Você não possui tarefas!!</p>
      )}

      {filteredTask.map((task) => (
        <div
          key={task.id}
          className="w-60 border rounded p-3 shadow-sm flex flex-col gap-2"
        >
          <div
            className={`h-1 w-full ${
              task.done ? "bg-green-400" : "bg-red-500"
            }`}
          ></div>

          <p
            className="cursor-pointer text-sm hover:text-gray-700"
            onClick={() => handleToggleTask(task.id)}
          >
            {task.task}
          </p>

          <div className="flex items-center gap-4">
            <EditTask task={task} handlegetTasks={handlegetTasks} />
            <Trash
              size={16}
              className="cursor-pointer text-gray-700 hover:text-red-500"
              onClick={() => handleDeleteTask(task.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskListContent;
