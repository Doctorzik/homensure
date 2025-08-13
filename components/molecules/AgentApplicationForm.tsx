"use client";

import {
  useForm,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  agentApplicationSchema,
} from "@/lib/schemas/userSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { z } from "zod";

import { createAgentApplication } from "@/lib/actions/agent-actions";

import { redirect } from 'next/navigation'
type FormData = z.infer<typeof agentApplicationSchema>;

export function AgentApplicationForm() {


  const {

    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(agentApplicationSchema),
  });









  const onSubmit = async (data: FormData) => {

    const response = await createAgentApplication(data)

    if (response) {
      alert(response.message)
      redirect("/user/profile")
      return
    }




  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold">Agent Application</h2>

      {/* First Name */}
      <div>

        <Input label="First Name" id="firstName" {...register("firstName")} />
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
      </div>

      {/* Last Name */}
      <div>

        <Input label="Last Name" id="lastName" {...register("lastName")} />
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
      </div>

      {/* Phone Number */}
      <div>

        <Input label="Phone Number" id="phoneNumber" type="number"{...register("phoneNumber", { valueAsNumber: true })} />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
      </div>

      {/* Date of Birth */}
      <div>

        <Input label="Date of Birth" id="dateOfBirth" type="date"  {...register("dateOfBirth")} />
        {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
      </div>

      {/* Gender */}
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">MALE</SelectItem>
                <SelectItem value="FEMALE">FEMALE</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
      </div>

      {/* National ID */}
      <div>

        <Input label="National Id Number" id="nationalIdNumber" {...register("nationalIdNumber")} />
        {errors.nationalIdNumber && <p className="text-red-500 text-sm">{errors.nationalIdNumber.message}</p>}
      </div>

      {/* Video URL */}
      <div>

        <Input label="Video Url" id="videoUrl" {...register("videoUrl")} />
        {errors.videoUrl && <p className="text-red-500 text-sm">{errors.videoUrl.message}</p>}
      </div>

      {/* Address */}
      <div>

        <Input label="Address" id="address" {...register("address")} />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      {/* Locality */}
      <div>

        <Input label="Prefferd Locality" id="desiredLocality" {...register("desiredLocality")} />
        {errors.desiredLocality && <p className="text-red-500 text-sm">{errors.desiredLocality.message}</p>}
      </div>

      {/* Experience (optional) */}
      <div>

        <Input label="Experience" id="experience" type="number" {...register("experience", { valueAsNumber: true })} />
      </div>

      {/* Motivation */}
      <div>
        <Label htmlFor="motivation">Motivation</Label>
        <Textarea id="motivation" rows={5} {...register("motivation")} />
        {errors.motivation && <p className="text-red-500 text-sm">{errors.motivation.message}</p>}
      </div>

      {/* Past Roles (optional) */}
      <div>
        <Label htmlFor="pastRoles">Past Related Roles</Label>
        <Textarea id="pastRoles" rows={3} {...register("pastRoles")} />
      </div>

      {/* Submit */}
      <Button type="submit" variant={"secondary"} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
