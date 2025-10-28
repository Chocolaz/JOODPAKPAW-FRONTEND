import AuthHeader from '../_components/AuthHeader'
import VerifyOtpForm from '../_components/VerifyOtpForm'

export default function VerifyOtpPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="z-10 mt-20 text-center">
          <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
            Verify Your Account
          </h1>
          <div className="text-[20px]">
            Check your email and enter the One-Time Password (OTP) <br />
            to complete your registration.
          </div>
        </div>
      </AuthHeader>
      <VerifyOtpForm />
    </div>
  )
}
