// Components
import Button from "../components/Button";

function Home({ connectionHandler }) {
  // Return Home component.
  return (
    <>
      <h1 className="mb-4 text-center text-3xl font-bold">
        Welcome to CryptoKids!
      </h1>
      {/* Button to connect wallet using MetaMask */}
      <Button onClick={connectionHandler} variant="large">
        Sign up as a parent
      </Button>
    </>
  );
}

export default Home;
