import AuthHeader from '../_components/AuthHeader'
import RegisterForm from '../_components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="z-10 mt-20 mx-5 text-center">
          <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
            Join the JOODPAKPAW
          </h1>
          <div className="text-[20px]">
            Create your account and start finding safe, <br />
            loving stays for your pet.
          </div>
        </div>
      </AuthHeader>
      <RegisterForm />
    </div>
  )
}
