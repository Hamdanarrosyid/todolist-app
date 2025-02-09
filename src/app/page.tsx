'use client';
import DataTable from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ResponseWrapper, User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons"

import debounce from "lodash.debounce"
import { Button } from "@/components/ui/button";
import CreateuserDialog from "@/components/create-user-dialog";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function Home() {
  const [firstname, setFirstname] = useState("");
  const [debouncedFirstname, setDebouncedFirstname] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [page, setPage] = useState(1)

  const router = useRouter()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "firstname",
      header: "First Name",
    },
    {
      accessorKey: "lastname",
      header: "Last Name",
    },
    {
      accessorKey: "birthdate",
      header: "Birthdate",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => <ButtonDelete id={row.original.id} />
    }
  ]

  const debouncedSearch = debounce((value: string) => {
    setDebouncedFirstname(value)
  }, 500)

  useEffect(() => {
    debouncedSearch(firstname)
    return () => debouncedSearch.cancel()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstname])

  const { isPending, error, data } = useQuery<ResponseWrapper<User[]>>({
    queryKey: ['users', debouncedFirstname, page],
    queryFn: () => fetch(`/api/users?search=${debouncedFirstname}&page=${page}`).then(res => res.json())
  })

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="container mx-auto px-[20px]" >
      <div className="my-20 mx-auto flex flex-col items-center">
        <div>
          <h1 className="text-4xl font-bold  text-center">Users Tabel</h1>
          <p className="text-muted-foreground text-md ">click on the user table to see all user todos </p>
          <Separator className="mt-4" />
        </div>
      </div>

      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter firstname..."
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon />
        </Button>
      </div>
      <div>
        <DataTable
          isLoading={isPending}
          columns={columns}
          data={data?.data}
          page={data?.page}
          total={data?.total}
          onClickNext={() => setPage(page + 1)}
          onclikcPrev={() => setPage(page - 1)}
          onClickRow={(row) => {
            router.push(`/users/${row.original.id}`)
          }}
        />

      </div>

      <CreateuserDialog isOpen={isOpen} onOpenChange={() => setIsOpen(false)} />
    </div>
  )
}

const ButtonDelete = ({ id }: { id: string }) => {
  const queryClient = useQueryClient()
  const mutationDelete = useMutation({
    mutationKey: ["users"],
    mutationFn: (id: string) => {
      return fetch(`/api/users/${id}`, {
        method: "DELETE"
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  })

  return (
    <Button disabled={mutationDelete.isPending} size='sm' type="button" onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      mutationDelete.mutate(id)
    }}>
      {
        mutationDelete.isPending ?
          <Loader2 className="animate-spin" />
          : <Trash2 />
      }
    </Button>
  )
}