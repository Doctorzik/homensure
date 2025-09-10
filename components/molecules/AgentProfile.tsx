"use client"
import { useForm } from "react-hook-form";
import { appUrls, UserWithApplication } from "@/app/utils/constant";
import { formatDate, ProfileField } from "./ProfileField";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Label } from "../ui/label";
import Input from "../ui/input";

import { UpdateUserAgent } from "@/lib/actions/user-actions";
import { Card } from "../ui/card";
import Link from "next/link";
import z from "zod";
import { AgentProfileSchema, AgentUserAppication } from "@/lib/schemas/userSchema";

import { Edit2Icon, Edit3Icon } from "lucide-react";
import { Textarea } from "../ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { superbase } from "@/superbase/superbase";
import { useState } from "react";


import { updateProfileImage } from "@/lib/actions/agent-actions";




export default function AgentProfileEdit(user: UserWithApplication) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("")
  const [open, setOpen] = useState(false)


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setFile(file)
    }
  }



  const handleUpload = async () => {

    if (!file) return
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `agents/${fileName}`;
      await superbase.storage.from("profileImage").upload(filePath, file, {
        upsert: true
      });

      if (user.image) {
        const imageUrl = user.image?.split("profileImage/")[1].toString()
        await superbase.storage.from("profileImage").remove([imageUrl])
      }

      // get public URL
      const { data } = superbase.storage
        .from("profileImage")
        .getPublicUrl(filePath);
      await updateProfileImage(data.publicUrl, user.id)



    } catch (error) {
      console.error(error);

    } finally {
      setPreview("")
      setUploading(false);
      setOpen(false)
    }
  };

  return (

    <Card className="mt-5 p-2">
      <div className="flex flex-row justify-between  items-center gap-2">
        <div className="relative">
          <h2 className=" lg:text-2xl font-bold mb-4">Welcome <span className="whitespace-nowrap">{user.name ? user.name : user.fullName.split(" ")[0]}</span>

          </h2>


        </div>

        <div className="p-0 whitespace-nowrap">
          <Button variant="link">
            <Link href={appUrls.agentProperties}>My Properties</Link>
          </Button>
        </div>
      </div>

      <div className=" m-auto md:m-0  relative">

        <Avatar className="rounded-lg size-30">
          <AvatarImage src={user.image as string} />
          <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <Dialog open={open} onOpenChange={() => setOpen(true)} >
          <DialogTrigger asChild>
            <Button className="top-25 lg:top-30 sm:left-10 absolute  text-amber-50 text-[10px] ">
              <Edit3Icon />
            </Button>
          </DialogTrigger>
          <DialogContent>
          
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpload()
            }}>
              <DialogHeader>
                <DialogTitle>Edit profile Image</DialogTitle>
               
              </DialogHeader>
              <input type="file" size={4} onChange={handleImageChange} />

              {
                preview && <Avatar className="rounded-lg size-30">
                  <AvatarImage src={preview} />
                  <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              }

              <DialogFooter className="bg-red-200 flex  md:justify-center items-center ">
                <DialogClose asChild>
                  <Button disabled={uploading} type="reset" variant="outline" onClick={() => setPreview("")}>Cancel</Button>
                </DialogClose>
                {uploading && (
                  <div className="flex justify-center items-center mt-4">
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                  </div>
                )}
                <Button disabled={uploading} type="submit" variant="secondary">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>

        </Dialog>

      </div>

      <div className="text-right">
        <EditPropfileDialog {...user} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center ">
        <div className="space-y-2">
          <h3 className=" text-center font-bold ">Personal Details</h3>
          {
            user.name ?
              <ProfileField label="Full Name" value={user.name} /> :
              <ProfileField label="Full Name" value={user.fullName} />
          }
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Phone" value={user.phone} />
          <ProfileField label="Date of Birth" value={user.dateOfBirth} />
          <ProfileField label="Gender" value={user.gender.charAt(0)} />
          <ProfileField label="Address" value={user.address} />
          <ProfileField label="Locality" value={user.locality} />
          <ProfileField label="Country" value={user.country} />
          <ProfileField label="About" value={user.about} />
        </div>
        <div className="space-x-2">
          <h3 className="text-center font-bold">Other Informations</h3>
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
          <ProfileField label="Account Created" value={formatDate(user.createdAt)} />

        </div>

      </div>


    </Card>
  )
}

const EditPropfileDialog = (user: UserWithApplication) => {

  const {

    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof AgentProfileSchema>>(
    {
      resolver: zodResolver(AgentProfileSchema),
      defaultValues: {
        firstName: user.fullName,
        lastName: user.fullName,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        nationalIdNumber: user.nationalId as string,
        about: user.about || "",
        country: user.country,
        phone: user.phone,
        locality: user.locality,
        email: user.email,

      }
    })

  const handleformSubmit = async (data: AgentUserAppication) => {



    await UpdateUserAgent(data)

  }

  return (
    <Dialog >

      <DialogTrigger asChild>
        <Button variant="outline">
          <span>
            <Edit2Icon size="4" />
          </span>
          Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="md:p-[24px] sm:p-[1px] ">
        <form onSubmit={handleSubmit(handleformSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid ">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="about">Tell others about you</Label>
                <Textarea {...register("about")} id="about" />
                {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}

                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input label="" {...register("phone")} id="phoneNumber" type="number"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

                <Label htmlFor="email">Email</Label>
                <Input label=""
                  {...register("email")}
                  id="email"
                  type="email"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                <Label htmlFor="firstName">First Name</Label>
                <Input label=""
                  {...register("firstName")}
                  id="firstName"
                  type="text"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}


                <Label htmlFor="lastName">Last Name</Label>
                <Input label=""
                  {...register("lastName")}
                  id="lastName"
                />


              </div>

              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              <div>
                <Label htmlFor="address">Enter Address</Label>
                <Textarea {...register("address")} id="address" />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                <Label htmlFor="locality">Locality </Label>
                <Input label=""{...register("locality")} id="locality" />
                {errors.locality && <p className="text-red-500 text-sm">{errors.locality.message}</p>}
                <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                <Input label=""{...register("dateOfBirth")} id="dateOfBirth" type="date" />
                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}

                <Label htmlFor="country">Country</Label>
                <Input label=""
                  {...register("country")}
                  id="country"
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                <Label htmlFor="nationalIdNumber">National ID</Label>
                <Input label="" {...register("nationalIdNumber")} id="nationalIdNumber" />
                {errors.nationalIdNumber && <p className="text-red-500 text-sm">{errors.nationalIdNumber.message}</p>}
              </div>
            </div>


          </div>
          <DialogFooter className="bg-red-200 flex  md:justify-center items-center ">
            <DialogClose asChild>
              <Button type="reset" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="secondary" >Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>

    </Dialog>
  )
}