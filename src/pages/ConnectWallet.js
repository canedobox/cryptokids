import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Components
import Button from "../components/Button";
import ErrorMessage from "../components/ErrorMessage";

function ConnectWallet({
  accountType,
  connectionHandler,
  errorMessage,
  setErrorMessage
}) {
  /***** UTILS *****/
  // Set useNavigate hook.
  const navigateTo = useNavigate();

  /**
   * Listen for changes to `accountType`.
   */
  useEffect(() => {
    if (accountType === "not-registered") {
      // Navigate to homepage.
      navigateTo("/");
    }
  }, [accountType]);

  // Return ConnectWallet component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-col">
      <main className="flex h-screen w-screen min-w-[theme(width.80)] flex-col items-center justify-center gap-4">
        <h1 className="mb-4 text-center font-medium">
          Connect your wallet to access the dashboard.
        </h1>
        {/* Button to connect wallet using MetaMask */}
        <Button onClick={connectionHandler} variant="large">
          Connect Wallet
        </Button>
      </main>
      {/* Error message */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
}

export default ConnectWallet;
