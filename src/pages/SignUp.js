import { Link } from "react-router-dom";

function SignUp() {
  // Return SignUp component.
  return (
    <>
      <h1 className="text-3xl font-bold">Sign Up</h1>
      <Link
        to="/"
        className="flex h-16 cursor-pointer items-center justify-center gap-2 px-2"
      >
        Go to homepage
      </Link>
      <Link
        to="/dashboard"
        className="flex h-16 cursor-pointer items-center justify-center gap-2 px-2"
      >
        Go to dashboard
      </Link>
    </>
  );
}

export default SignUp;
