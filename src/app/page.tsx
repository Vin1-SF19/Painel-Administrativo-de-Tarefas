"use client";

import { Badge } from "@/components/ui/badge";
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
import EditTask from "@/components/edit-task";
import { getTasks } from "@/actions/get-task-from-db";
import { useEffect, useState } from "react";
import { Task } from "@/generated/prisma";
import { NewTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { toast } from "sonner";
import { UpdateTaskStatus } from "@/actions/toggle-done";
import { Filter } from "@/components/filter";
import { deleteCompletedTasks } from "@/actions/clear-completed-task";

const home = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);

  const [task, setTask] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [currentFilter, setCurrentFilter] = useState<FilterType>("all");

  const [filteredTask, setFilteredTask] = useState<Task[]>([]);

  const handlegetTasks = async () => {
    try {
      const tasks = await getTasks();

      if (!tasks) return;

      setTaskList(tasks);
    } catch (error) {
      throw error;
    }
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      if (task.length === 0 || !task) {
        toast.error("Insira uma atividade!!");
        setLoading(false);
        return;
      }
      const myNewTask = await NewTask(task);

      if (!myNewTask) return;
      setTask("");
      await handlegetTasks();
      toast.success("Atividade Adicionada com sucesso");
    } catch (error) {
      throw error;
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return;

      const deletedTask = await deleteTask(id);

      if (!deletedTask) return;
      console.log(deletedTask);
      await handlegetTasks();
      toast.warning("Atividade deletada com sucesso");
    } catch (error) {
      throw error;
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const previousTasks = [...taskList];

    try {
      setTaskList((prev) => {
        const UpdatedTaskList = prev.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              done: !task.done,
            };
          } else {
            return task;
          }
        });

        return UpdatedTaskList;
      });

      await UpdateTaskStatus(taskId);
    } catch (error) {
      setTaskList(previousTasks);
      throw error;
    }
  };

  const clearCompletedTask = async () => {
    const deletedTask = await deleteCompletedTasks();

    if (!deletedTask) return;

    setTaskList(deletedTask);
  };

  useEffect(() => {
    handlegetTasks();
  }, []);

  useEffect(() => {
    switch (currentFilter) {
      case "all":
        setFilteredTask(taskList);
        break;
      case "pending":
        const pedingTask = taskList.filter((task) => !task.done);
        setFilteredTask(pedingTask);
        break;
      case "completed":
        const completedTasks = taskList.filter((task) => task.done);
        setFilteredTask(completedTasks);
    }
  }, [currentFilter, taskList]);
  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-lg">
        <CardContent className="flex gap-2">
          <Input
            placeholder="adicionar tarefa"
            onChange={(e) => setTask(e.target.value)}
            value={task}
          />
          <Button
            variant="default"
            className="cursor-pointer"
            onClick={handleAddTask}
          >
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
          <div className="mt-4 border-b-1">
            {filteredTask.length === 0 && (
              <p className="text-xs border-t-1 py-4">
                Voce nao possui Tarefas!!
              </p>
            )}

            {filteredTask.map((task) => (
              <div
                className="h-14 flex justify-between items-center border-b-1 border-t-1"
                key={task.id}
              >
                <div
                  className={`${
                    task.done
                      ? "bg-green-300 w-1 h-full"
                      : "bg-red-600 w-1 h-full"
                  }`}
                ></div>
                <p
                  className="flex-1 px-2 text-sm cursor-pointer hover:text-gray-700"
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.task}
                </p>
                <div className="flex items-center gap-2">
                  <EditTask task={task} handlegetTasks={handlegetTasks} />
                  <Trash
                    size={16}
                    className="cursor-pointer"
                    onClick={() => handleDeleteTask(task.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              <ListCheck size={18} />
              <p className="text-xs">
                Tarefas concluidas (
                {taskList.filter((Tasks) => Tasks.done).length}/
                {taskList.length})
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="text-xs h-7 cursor-pointer"
                  variant={"outline"}
                >
                  <Trash /> Limpar tarefas concluidas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir X itens?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction
                    className="cursor-pointer"
                    onClick={clearCompletedTask}
                  >
                    Sim
                  </AlertDialogAction>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-2 w-full bg-gray-100 mt-4 rounded-md">
            <div
              className="h-full bg-blue-500 rounded-md"
              style={{
                width: `${
                  (taskList.filter((task) => task.done).length /
                    taskList.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-2 gap-2">
            <Sigma size={18} />
            <p className="text-xs">{taskList.length} Tarefas no total</p>
          </div>
        </CardContent>

        <div></div>
      </Card>
    </main>
  );
};

export default home;
