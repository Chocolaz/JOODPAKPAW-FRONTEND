import AuthHeader from '../_components/AuthHeader'
import VerifyOtpForm from '../_components/VerifyOtpForm'

export default function VerifyOtpPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="z-10 mt-20 mx-5 text-center">
          <h1 className="text-4xl font-bold text-accent-orange  ">
            Verify your email
          </h1>
        </div>
      </AuthHeader>
      <VerifyOtpForm />
    </div>
  )
}
