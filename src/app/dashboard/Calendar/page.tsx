"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");

  // TAREFAS QUE VÊM DO BANCO
  const [tasks, setTasks] = useState<
    { id: string; task: string; date: string }[]
  >([]);

  //  BUSCAR AS TAREFAS DO BD
  async function getCalendarTasks() {
    try {
      const res = await fetch("/api/calendar/list");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getCalendarTasks();
  }, []);

  //  QUANDO CLICAR NO CALENDÁRIO
  function handleSelect(date: Date | undefined) {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      toast.error("Você não pode adicionar atividade em datas passadas.");
      return;
    }

    setSelectedDate(date);
    setOpen(true);
  }

  //  SALVAR ATIVIDADE
  async function handleAddTask() {
    if (!taskName.trim()) {
      toast.error("Digite uma atividade!");
      return;
    }

    try {
      const res = await fetch("/api/calendar/add", {
        method: "POST",
        body: JSON.stringify({
          taskName,
          date: selectedDate?.toISOString(),
        }),
      });

      if (!res.ok) {
        toast.error("Erro ao salvar no banco!");
        return;
      }

      toast.success(
        `Atividade adicionada para ${selectedDate?.toLocaleDateString("pt-BR")}`
      );

      setTaskName("");
      setOpen(false);
      getCalendarTasks(); 
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado.");
    }
  }

  // nao ta funcional pois o  shadcn não aceita modifiersStyles
  const modifiers = {
    hasOne: (date: Date) =>
      tasks.filter(
        (t) => new Date(t.date).toDateString() === date.toDateString()
      ).length === 1,

    hasMany: (date: Date) =>
      tasks.filter(
        (t) => new Date(t.date).toDateString() === date.toDateString()
      ).length >= 2,
  };

  const classNames = {
    day_hasOne: "bg-orange-300 text-black rounded-md font-bold",
    day_hasMany: "bg-red-300 text-black rounded-md font-bold",
  };

  //  LAYOUT
  return (
    <div className="w-full h-full flex p-6 gap-6">
      
      <div className="flex-1 flex justify-center items-center">
        <CalendarUI
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="rounded-md border shadow-lg p-6 w-[600px] max-w-full"
          captionLayout="dropdown"
          modifiers={modifiers}
          classNames={classNames}
        />
      </div>

      <div className="w-64 border rounded-lg shadow p-4 bg-white h-fit">
        <h2 className="text-lg font-semibold mb-3">Todas atividades</h2>

        {tasks.length === 0 && (
          <p className="text-xs text-gray-500">Nenhuma atividade cadastrada</p>
        )}

        <ul className="flex flex-col gap-2 text-sm">
          {tasks
            .sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .map((t) => {
              const d = new Date(t.date);
              const dataBR = d.toLocaleDateString("pt-BR");

              return (
                <li
                  key={t.id}
                  className="p-2 border rounded bg-gray-100 text-gray-800"
                >
                  Tarefa para o dia <b>{dataBR}</b>:<br />
                  {t.task}
                </li>
              );
            })}
        </ul>
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar atividade</DialogTitle>
            <DialogDescription>
              {selectedDate?.toLocaleDateString("pt-BR")}
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Digite a atividade..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
