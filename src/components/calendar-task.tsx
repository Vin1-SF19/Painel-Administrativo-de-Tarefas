"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type CalendarTasksProps = {
  onCreated?: (task: any) => void;
};

export default function CalendarTasks({ onCreated }: CalendarTasksProps) {
  const [selected, setSelected] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [datesWithTasks, setDatesWithTasks] = React.useState<string[]>([]); // 'YYYY-MM-DD' strings

  React.useEffect(() => {
    // fetch dates with tasks to mark calendar (initial)
    fetch("/api/calendar/list")
      .then((r) => r.json())
      .then((data) => {
        if (data?.tasks) {
          const dd = data.tasks.map((t: any) =>
            new Date(t.dueDate).toISOString().slice(0, 10)
          );
          setDatesWithTasks(dd);
        }
      })
      .catch(console.error);
  }, []);

  const handleSelect = (d?: Date) => {
    if (!d) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sel = new Date(d);
    sel.setHours(0, 0, 0, 0);
    if (sel < today) {
      // não abre para passado
      toast.error("Não é possível marcar datas passadas");
      return;
    }
    setSelected(sel);
    setOpen(true);
  };

  const handleAdd = async () => {
    if (!selected || text.trim() === "") {
      toast.error("Insira a descrição");
      return;
    }
    const res = await fetch("/api/calendar/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, date: selected.toISOString() }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Tarefa com data adicionada");
      const key = selected.toISOString().slice(0, 10);
      setDatesWithTasks((s) => Array.from(new Set([...s, key])));
      setText("");
      setOpen(false);
      onCreated?.(data.task);
    } else {
      toast.error(data?.error || "Erro");
    }
  };

  // Helper para marcar dias: adiciona uma bolinha laranja abaixo do dia via CSS classe
  React.useEffect(() => {
    // tenta marcar dias no calendário: procura botões com data ISO no atributo title/aria-label
    // IMPLEMENTAÇÃO GENÉRICA: procura elementos com data-iso atributo (se seu Calendar renderizar algo parecido)
    // Se seu Calendar não expor isso, você pode optar pela alternativa "lista de tarefas" abaixo.
    // Aqui, tentamos encontrar botões com data em formato 'YYYY-MM-DD' no atributo 'data-day'
    setTimeout(() => {
      const buttons = document.querySelectorAll("[data-day]");
      buttons.forEach((b) => {
        const el = b as HTMLElement;
        const day = el.getAttribute("data-day"); // depende do calendar, pode ser undefined
        if (day && datesWithTasks.includes(day)) {
          el.classList.add("has-calendar-task"); // classe que vamos estilizar via css global
        } else {
          el.classList.remove("has-calendar-task");
        }
      });
    }, 200);
  }, [datesWithTasks, selected, open]);

  return (
    <>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={handleSelect}
        className="rounded-md border shadow-sm w-auto mx-auto mt-10"
        captionLayout="dropdown"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Criar tarefa para o dia{" "}
              {selected
                ? `${selected.getDate()}/${
                    selected.getMonth() + 1
                  }/${selected.getFullYear()}`
                : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <Input
              placeholder="Descrição da tarefa"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleAdd}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        /* estilo simples para marcar dias; depende se seu calendar renderiza [data-day="YYYY-MM-DD"] */
        .has-calendar-task {
          position: relative;
        }
        .has-calendar-task::after {
          content: "";
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: orange;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </>
  );
}
