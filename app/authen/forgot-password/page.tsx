import AuthHeader from '../_components/AuthHeader'
import ForgotPasswordForm from '../_components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="mt-20 text-center mx-5">
          <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
            Forgot your password?
          </h1>
          <div className="text-[20px]">
            Enter your email and we’ll send you a link to create a new password.
          </div>
        </div>
      </AuthHeader>
      <ForgotPasswordForm />
    </div>
  )
}
