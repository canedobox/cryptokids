import { Link } from "react-router-dom";

function Home() {
  // Return Home component.
  return (
    <>
      <h1 className="text-3xl font-bold">Home</h1>
      <Link
        to="/signup"
        className="flex h-16 cursor-pointer items-center justify-center gap-2 px-2"
      >
        Go to sign up page
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

export default Home;
