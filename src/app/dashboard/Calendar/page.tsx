"use client";

import { useState } from "react";
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

  function handleAddTask() {
    if (!taskName.trim()) {
      toast.error("Digite uma atividade!");
      return;
    }

    const dataFormatada = selectedDate?.toLocaleDateString("pt-BR");

    toast.success(`Atividade adicionada para ${dataFormatada}`);

    setTaskName("");
    setOpen(false);
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-10">
      <CalendarUI
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        className="rounded-md border shadow-lg p-6 scale-[1.3]"
        captionLayout="dropdown"
      />

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
