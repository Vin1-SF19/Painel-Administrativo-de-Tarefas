"use client";

import { Trash } from "lucide-react";
import EditTask from "./edit-task";
import { Task } from "@/generated/prisma";
import { CalendarDays } from "lucide-react";

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

      {filteredTask.map((task) => {
        const hasDate = task.date !== null && task.date !== undefined;
        const formattedDate = hasDate
          ? new Date(task.date).toLocaleDateString("pt-BR")
          : null;

        return (
          <div
            key={task.id}
            onClick={() => handleToggleTask(task.id)}
            className={`w-50 min-h-50 border rounded p-3 shadow-sm flex flex-col gap-2 items-center text-xs transition-all  cursor-pointer
          ${
            hasDate
              ? "border-orange-400 bg-orange-50"
              : "border-gray-300 bg-white"
          }
        `}
          >
            <div
              className={`h-1 w-full ${
                task.done
                  ? "bg-green-400"
                  : hasDate
                  ? "bg-orange-400"
                  : "bg-red-500"
              }`}
            ></div>

            <p className=" text-sm hover:text-gray-800 font-bold text-xl text-center">
              {task.task}
            </p>

            {hasDate && (
              <div className="flex items-center gap-2 text-orange-700 text-xs font-semibold mt-[-6px]">
                <CalendarDays size={14} />
                <span>Para {formattedDate}</span>
              </div>
            )}

            <div className="flex items-center gap-4 mt-2">
              <EditTask task={task} handlegetTasks={handlegetTasks} />
              <Trash
                size={16}
                className="cursor-pointer text-gray-700 hover:text-red-500"
                onClick={() => handleDeleteTask(task.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TaskListContent;
