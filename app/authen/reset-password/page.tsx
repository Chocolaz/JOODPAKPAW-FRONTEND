import AuthHeader from '../_components/AuthHeader'
import ResetPasswordForm from '../_components/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="mt-20 text-center">
          <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
            Create a new password
          </h1>
          <div className="text-[20px]">
            Choose a strong password you’ll remember
            <br />
            You’ll use it to sign in next time
          </div>
        </div>
      </AuthHeader>
      <ResetPasswordForm />
    </div>
  )
}
