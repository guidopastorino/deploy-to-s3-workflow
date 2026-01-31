"use client";

import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function TodosPage() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    fetchTodos().finally(() => setLoading(false));
  }, [fetchTodos]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      await fetchTodos();
    }
  }

  async function handleDelete(id: number) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-8 dark:bg-zinc-900">
      <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
        <h1 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Todos
        </h1>

        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Añadir todo..."
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600"
          />
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Añadir
          </button>
        </form>

        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Cargando...
          </p>
        ) : items.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No hay todos. Añade uno arriba.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-600 dark:bg-zinc-700/50"
              >
                <span className="text-zinc-900 dark:text-zinc-50">
                  {todo.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(todo.id)}
                  className="rounded p-2 text-zinc-500 transition hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                  aria-label="Borrar"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
