"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  List,
  Check,
  CircleAlert,
  Trash,
  ListCheck,
  Sigma,
} from "lucide-react";
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
import { useState } from "react";
const home = () => {
  const [taskList, setTaskList] = useState([]);

  const handlegetTasks = async () => {
    const tasks = await getTasks();
    console.log(tasks);
  };
  return (
    <main className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <Card className="w-lg">
        <CardContent className="flex gap-2">
          <Input placeholder="adicionar tarefa" />
          <Button variant="default" className="cursor-pointer">
            {" "}
            <Plus />
            Cadastrar
          </Button>
        </CardContent>

        <Button onClick={handlegetTasks}>Pesquisar tarefas</Button>
        <CardContent>
          <Separator className="mb-2" />
          <div className="m-2 flex gap-2">
            <Badge className="cursor-pointer" variant="default">
              <List /> Todas
            </Badge>
            <Badge className="cursor-pointer" variant="outline">
              <CircleAlert /> Não Finalizadas
            </Badge>
            <Badge className="cursor-pointer" variant="outline">
              <Check /> Concluidas
            </Badge>
          </div>

          <div className="mt-4 border-b-1">
            <div className="h-14 flex justify-between items-center border-b-1 border-t-1">
              <div className="bg-green-300 w-1 h-full"></div>
              <p className="flex-1 px-2 text-sm">Estudar</p>
              <div className="flex items-center gap-2">
                <EditTask />
                <Trash size={16} className="cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div className="flex gap-2 items-center">
              <ListCheck size={18} />
              <p className="text-xs">Tarefas concluidas (3/3)</p>
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
                  <AlertDialogAction>Sim</AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-2 w-full bg-gray-100 mt-4 rounded-md">
            <div
              className="h-full bg-blue-500 rounded-md"
              style={{ width: "50%" }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-2 gap-2">
            <Sigma size={18} />
            <p className="text-xs">3 Tarefas no total</p>
          </div>
        </CardContent>

        <div></div>
      </Card>
    </main>
  );
};

export default home;
