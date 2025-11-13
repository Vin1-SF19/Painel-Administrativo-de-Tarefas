import { SquarePen } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Task } from "@/generated/prisma";
import { useState } from "react";
import { toast } from "sonner";
import { editTask } from "@/actions/edit-task";
import { DialogClose } from "@radix-ui/react-dialog";

type taskProps = {
  task: Task;
  handlegetTasks: () => void;
};

const EditTask = ({ task, handlegetTasks }: taskProps) => {
  const [editedTask, setEditedTask] = useState(task.task);

  const handleEditTask = async () => {
    try {
      if (editedTask !== task.task) {
        toast.success("Tarefa Alterada");
      } else {
        toast.error("As informaçoes nao foram alteradas");
        return;
      }

      await editTask({ idTask: task.id, newtask: editedTask });
      handlegetTasks();
    } catch (error) {
      throw error;
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SquarePen size={16} className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Editar Tarefa"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
          />

          <DialogClose asChild>
            <Button className="cursor-pointer" onClick={handleEditTask}>
              Editar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTask;
