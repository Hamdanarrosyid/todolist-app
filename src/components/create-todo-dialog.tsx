'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Todo } from "@/types"
import { CreateTodoDto } from "@/dto/createTodoDto"
import { useParams } from "next/navigation"
import { Textarea } from "./ui/textarea"
import { CreateTodoValidation } from "@/validation/createTodovalidation"

export default function CreateTodoDialog({
    isOpen,
    onOpenChange,
    todo
}: {
    isOpen: boolean,
    onOpenChange: () => void
    todo?: Todo
}) {
    const params = useParams<{ id: string }>()
    const form = useForm<CreateTodoDto>({
        resolver: zodResolver(CreateTodoValidation),
        defaultValues: new CreateTodoDto(
            todo ? todo.title : "",
            todo ? todo.description : "",
            params.id ?? ""
        )
    })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ["users"],
        mutationFn: (data: CreateTodoDto) => {
            return fetch(`/api/todos/${todo ? todo.id : ''}`, {
                method: todo ? "PUT" : "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] })
            if (todo) {
                form.reset()
            } else {
                form.reset(new CreateTodoDto(
                    "",
                    "",
                    params.id ?? ""
                ))

            }
        }
    })



    const onSubmit: SubmitHandler<CreateTodoDto> = (data) => {
        mutation.mutate(data)
        onOpenChange()
    }


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{todo ? "Update Todo" : 'Create Todo'}</DialogTitle>
                    <DialogDescription>
                        please fill in the form below to {todo ? 'update' : 'create'} a todo
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <input type="hidden" {...form.register("user_id")} />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task 1" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.title?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder=".." {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button disabled={mutation.isPending} type="submit">{
                                mutation.isPending ? <>
                                    <Loader2 className="animate-spin" />
                                    Please wait</> : "Save changes"
                            }</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>


            </DialogContent>
        </Dialog>
    )
}
