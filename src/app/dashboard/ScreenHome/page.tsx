"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash, ListCheck, Sigma, LoaderCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { getTasks } from "@/actions/get-task-from-db";
import { NewTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { deleteCompletedTasks } from "@/actions/clear-completed-task";
import { UpdateTaskStatus } from "@/actions/toggle-done";

import { useEffect, useState } from "react";
import { Task } from "@/generated/prisma";
import { toast } from "sonner";
import { Filter } from "@/components/filter";
import { TaskListContent } from "@/components/content-tasks";

export default function ScreenHome() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
  const [filteredTask, setFilteredTask] = useState<Task[]>([]);

  const handlegetTasks = async () => {
    const tasks = await getTasks();
    if (!tasks) return;
    setTaskList(tasks);
  };

  const handleAddTask = async () => {
    setLoading(true);

    if (!task.trim()) {
      toast.error("Insira uma atividade!");
      setLoading(false);
      return;
    }

    await NewTask(task);
    setTask("");
    await handlegetTasks();
    toast.success("Atividade adicionada!");

    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    await handlegetTasks();
    toast.warning("Atividade deletada!");
  };

  const handleToggleTask = async (taskId: string) => {
    const updated = taskList.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );

    setTaskList(updated);
    await UpdateTaskStatus(taskId);
  };

  const clearCompletedTask = async () => {
    const deleted = await deleteCompletedTasks();
    if (deleted) setTaskList(deleted);
  };

  useEffect(() => {
    handlegetTasks();
  }, []);

  useEffect(() => {
    if (currentFilter === "all") setFilteredTask(taskList);
    if (currentFilter === "pending")
      setFilteredTask(taskList.filter((t) => !t.done));
    if (currentFilter === "completed")
      setFilteredTask(taskList.filter((t) => t.done));
  }, [currentFilter, taskList]);

  return (
    <main className="flex justify-center w-full">
      <Card className="w-300 m-5 h-auto">
        <CardContent className="flex gap-2">
          <Input
            placeholder="adicionar tarefa"
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <Button onClick={handleAddTask}>
            {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
            Cadastrar
          </Button>
        </CardContent>

        <CardContent>
          <Separator className="mb-2" />

          <Filter
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />

          <TaskListContent
            filteredTask={filteredTask}
            handleToggleTask={handleToggleTask}
            handleDeleteTask={handleDeleteTask}
            handlegetTasks={handlegetTasks}
          />

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              <ListCheck size={18} />
              <p className="text-xs">
                Tarefas concluídas ({taskList.filter((t) => t.done).length}/
                {taskList.length})
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-xs h-7">
                  <Trash /> Limpar concluídas
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Apagar todas as tarefas concluídas?
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogAction onClick={clearCompletedTask}>
                    Sim
                  </AlertDialogAction>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-2 w-full bg-gray-100 mt-4 rounded-md">
            <div
              className="h-full bg-blue-500 rounded-md"
              style={{
                width: `${
                  (taskList.filter((t) => t.done).length / taskList.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-2 gap-2">
            <Sigma size={18} />
            <p className="text-xs">{taskList.length} tarefas no total</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
