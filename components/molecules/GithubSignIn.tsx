

import React from 'react'
import { Button } from '../ui/button'

import { signIn } from '@/lib/auth'



function GithubSignIn() {
  return (
    <form action={async () => {
      "use server"

      await signIn("github", { redirectTo: "/" })
    }}>

      <Button variant={'outline'}>

        Continue with with github
      </Button>
    </form>
  )
}

export default GithubSignIn