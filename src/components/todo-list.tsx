import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Todo } from "@/types";
import TodoItem from "./todo-item";
import CreateTodoDialog from "./create-todo-dialog";
import { useState } from "react";
import { Separator } from "./ui/separator";

export default function TodoList({
    user_id,
}: {
    user_id: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const query = useQuery<Todo[]>({
        queryKey: ["todos", user_id],
        queryFn: async () => {
            const response = await fetch(`/api/todos?user_id=${user_id}`);
            return response.json();
        },
    })

    if (query.isPending) {
        return <div className="h-screen flex justify-center items-center">
            <Loader2 className="animate-spin text-primary" size={52} />
        </div>
    }

    if (query.error) {
        return <div>Error: {query.error.message}</div>
    }

    return (
        <div className="flex justify-between gap-4">
            {
                query.data.length == 0 ? (
                    <h4 className="text-muted-foreground text-md">No todos yet</h4>

                ) :
                    <div className="flex flex-col gap-2 w-full">
                        {query.data.map(todo => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                    </div>
            }
            <div className="flex">
            <Separator  orientation="vertical" className="me-5"/>
            <Button type="button" onClick={() => setIsOpen(true)}>Create Todo</Button>
            <CreateTodoDialog isOpen={isOpen} onOpenChange={() => setIsOpen(false)} />

            </div>
        </div>
    )
}
