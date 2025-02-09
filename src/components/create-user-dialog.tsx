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
import { CreateUserDto } from "@/dto/createUserDto"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreateUserValidation } from "@/validation/createUserValidation"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { User } from "@/types"

export default function CreateuserDialog({
    isOpen,
    onOpenChange,
    user
}: {
    isOpen: boolean,
    onOpenChange: () => void
    user?: User
}) {
    const form = useForm<CreateUserDto>({
        resolver: zodResolver(CreateUserValidation),
        defaultValues: new CreateUserDto(
            user ? user.firstname : "",
            user ? user.lastname : "",
            user ? user.birthdate : ''
        )
    })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ["users"],
        mutationFn: (data: CreateUserDto) => {
            return fetch(`/api/users/${user ? user.id : ''}`, {
                method: user ? "PUT" : "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            if (user) {
                form.reset()
            } else {
                form.reset(new CreateUserDto())
            }
        }
    })



    const onSubmit: SubmitHandler<CreateUserDto> = (data) => {
        mutation.mutate(data)
        onOpenChange()
    }


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{user ? "Update User" : 'Create User'}</DialogTitle>
                    <DialogDescription>
                        please fill in the form below to {user ? 'update' : 'create'} a user
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.firstname?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.lastname?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthdate"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Birthdate</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.birthdate?.message}</FormMessage>
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
