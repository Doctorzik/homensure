
import cloundinary from "@/lib/cloudinary/cloudinary"
import { fileToBuffer } from "@/app/utils/fileToBuffer";
import { Button } from "@/components/ui/button";

import { CloudnaryImage } from "@/components/molecules/cloudnaryWidget";


export default function AgentProfilePage() {


  const handleSubmit = async (form: FormData) => {
    "use server"
    const file = form.get("file") as File

    const buffer = await fileToBuffer(file)
     await new Promise((resolve, reject) => {

      cloundinary.uploader.upload_stream({
        folder: "rentlynk",
        unique_filename: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }, function (error: any, result: any) {
        if (error) {
          reject(error)
          return
        }
        else {
          resolve(result)
        }
      }).end(buffer)

    })


  }


  return (

    <div>

      Agent Profile
      <form action={handleSubmit} >
        <input required type="file" name="file" ></input>
        <Button className="text-2xl text-white">Summit files</Button>
      </form>
      <CloudnaryImage />
    </div>
  )
}