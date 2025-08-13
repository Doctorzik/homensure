"use client"
import { useForm } from "react-hook-form";
import { AgentWithUser } from "@/app/utils/constant";
import { formatDate, ProfileField } from "./ProfileField";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import Input from "../ui/input";

import { UpdateUserAgent } from "@/lib/actions/user-actions";

type user = AgentWithUser

export default function AgentProfileEdit(user: user) {

  const form = useForm({
    defaultValues: {
      firstName: user.user.name || '',

    }
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {

    await UpdateUserAgent(data)


  }

  return (

    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProfileField label="First Name" value={user.fullName} />

        <ProfileField label="Email" value={user.user.email} />
        <ProfileField label="Phone" value={user.phone} />
        <ProfileField label="Date of Birth" value={user.dateOfBirth} />
        <ProfileField label="Gender" value={user.gender} />
        <ProfileField label="Address" value={user.address} />
        <ProfileField label="Locality" value={user.locality} />
        <ProfileField label="National ID" value={user.nationalId} />
        <ProfileField label="ID Type" value={user.idType} />
        <ProfileField label="ID Document" value={
          user.idUrl ? (
            <a
              href={user.idUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Document
            </a>
          ) : "N/A"
        } />
        <ProfileField label="Account Created" value={formatDate(user.user.createdAt)} />
        <ProfileField label="Last Updated" value={formatDate(user.user.updatedAt)} />
      </div>

      <Dialog>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="firstName">Name</Label>
                <Input {...form.register("firstName")} label="" id="firstName" name={user.user.name as string} defaultValue={user.user.name as string} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input  {...form.register("firstName")} label="" id="username-1" name="firstName" />
              </div>
            </div>
            <DialogFooter >
              <DialogClose asChild>
                <Button type="reset" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  )
}