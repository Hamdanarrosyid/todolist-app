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
import { useParams } from "next/navigation"
import { UpdateAddressDto } from "@/dto/updateAddressDto"
import { CreateAddressValidation } from "@/validation/createAddressValidation"
import { Address } from "@/types"

export default function UpdateAddressDialog({
    isOpen,
    onOpenChange,
    address
}: {
    isOpen: boolean,
    onOpenChange: () => void
    address: Address | null
}) {
    const params = useParams<{id: string}>()
    const form = useForm<UpdateAddressDto>({
        resolver: zodResolver(CreateAddressValidation),
        defaultValues: new UpdateAddressDto(
            params.id || "",
            address ? address.street : "",
            address ? address.city : "",
            address ? address.province : "",
            address ? address.postal_code : ""
        )
    })


    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationKey: ["users", params.id],
        mutationFn: (data: UpdateAddressDto) => {
            data.user_id = params.id
            return fetch(`/api/addresses/${address ? address.id: ''}`, {
                method: address ? "PUT" : "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users", params.id] })
            form.reset()
        }
    })



    const onSubmit: SubmitHandler<UpdateAddressDto> = (data) => {
        mutation.mutate(data)
        onOpenChange()
    }


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Address</DialogTitle>
                    <DialogDescription>
                        please fill in the form below to update the address
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <input type="hidden" {...form.register("user_id")} />
                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Province</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jawa Tengah" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.province?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Magelang" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.city?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Street</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.street?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postal_code"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage>{form.formState.errors.street?.message}</FormMessage>
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
