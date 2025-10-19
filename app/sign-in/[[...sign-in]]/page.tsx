import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <SignIn 
        afterSignInUrl="/admin"
        afterSignUpUrl="/admin"
        redirectUrl="/admin"
      />
    </div>
  )
}
