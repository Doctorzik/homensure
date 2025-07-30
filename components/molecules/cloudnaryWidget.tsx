"use client"

import { CldImage } from "next-cloudinary"


export const CloudnaryImage = () => {
  return (

    < CldImage
      alt="My clound"
      src="https://res.cloudinary.com/dj57rvnay/image/upload/v1753708608/rentlynk/in39a4cpngpcvfhtocn5.jpg"
      width={30}
      height={30}
      removeBackground
    />

  )
}
