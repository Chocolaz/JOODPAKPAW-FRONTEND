import AuthHeader from '../_components/AuthHeader'
import LoginForm from '../_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="mt-20 text-center mx-5">
          <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
            Login Here
          </h1>
          <div className="text-[20px]">
            Glad to see you again! <br />
            Let’s find the perfect stay for your furry friend.
          </div>
        </div>
      </AuthHeader>
      <LoginForm />
    </div>
  )
}
