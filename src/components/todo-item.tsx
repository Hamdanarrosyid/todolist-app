import { Todo } from "@/types";
import { Button } from "./ui/button";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import CreateTodoDialog from "./create-todo-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function TodoItem({
    todo
}: {
    todo: Todo
}) {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient()

    const mutationDelete = useMutation({
        mutationKey: ["todos"],
        mutationFn: (id: string) => {
            return fetch(`/api/todos/${id}`, {
                method: "DELETE"
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
        }
    })

    return (
        <div className="flex justify-between px-1 w-full">
            <div>
                <h1>{todo.title}</h1>
                <p className="text-muted-foreground text-sm">{todo.description}</p>
            </div>
            <div className="flex gap-2">
                <Button size='sm' type="button" onClick={() => setIsOpen(true)}><Edit2 /></Button>
                <CreateTodoDialog isOpen={isOpen} onOpenChange={() => setIsOpen(false)} todo={todo} />
                <Button disabled={mutationDelete.isPending} size='sm' type="button" onClick={() => {
                    mutationDelete.mutate(todo.id)
                }}>
                    {
                        mutationDelete.isPending ?
                            <Loader2 className="animate-spin" />
                            : <Trash2 />
                    }
                </Button>
            </div>
        </div>
    );
}