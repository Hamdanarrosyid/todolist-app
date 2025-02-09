'use client'

import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UpdateAddressDialog from "@/components/update-address-dialog";
import { useState } from "react";
import CreateuserDialog from "@/components/create-user-dialog";
import TodoList from "@/components/todo-list";

export default function DetailUser() {
    const { id } = useParams<{id: string}>();
    const [isOpenUpdateAddress, setIsOpenUpdateAddress] = useState(false)
    const [isOpenUpdateUser, setIsOpenUpdateUser] = useState(false)

    const query = useQuery<User>({
        queryKey: ["users", id],
        queryFn: () => fetch(`/api/users/${id}`).then(res => res.json())
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
        <div className="container mx-auto h-screen px-[20px]">
            <div className="grid grid-cols-12 pt-20 gap-4">
                <div className="lg:col-span-3 col-span-12">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-center">{query.data.firstname}</CardTitle>
                            <CardDescription className="text-center">
                                fill missing data if needed
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center flex-col gap-3">
                            <div className="w-full">
                                <h4 className="text-muted-foreground text-md">User detail</h4>
                                <Separator className="my-2" />

                                <div className="w-full flex flex-col gap-2">
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">First Name</p>
                                        <p className="text-md my-[2px]">{query.data.firstname}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">Last Name</p>
                                        <p className="text-md my-[2px]">{query.data.lastname}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">Birthdate</p>
                                        <p className="text-md my-[2px]">{query.data.birthdate}</p>
                                    </div>
                                    <Button type="button" className="w-full" onClick={() => setIsOpenUpdateUser(true)}> 
                                        Edit User
                                    </Button>
                                    <CreateuserDialog user={query.data} isOpen={isOpenUpdateUser} onOpenChange={() => setIsOpenUpdateUser(false)} />
                                </div>
                            </div>

                            <div className="w-full">
                                <h4 className="text-muted-foreground text-md">Address</h4>
                                <Separator className="my-2" />
                                <div className="w-full flex flex-col gap-2">
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">Province</p>
                                        <p className="text-md my-[2px]">{query.data.address?.province ?? 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">City</p>
                                        <p className="text-md my-[2px]">{query.data.address?.city ?? 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">Street</p>
                                        <p className="text-md my-[2px]">{query.data.address?.street ?? 'Not set'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-sm leading-none">Postal Code</p>
                                        <p className="text-md my-[2px]">{query.data.address?.postal_code ?? 'Not set'}</p>
                                    </div>
                                    <Button type="button" className="w-full" onClick={() => setIsOpenUpdateAddress(true)}>
                                        Edit Address
                                    </Button>
                                    <UpdateAddressDialog address={query.data.address ?? null} isOpen={isOpenUpdateAddress} onOpenChange={() => setIsOpenUpdateAddress(false)} />
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-9 col-span-12">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>List Todos</CardTitle>
                            <CardDescription>
                                List of todos for {query.data.firstname}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TodoList user_id={id}/>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}