import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Components
import Button from "../components/Button";

function ConnectWallet({ accountType, connectionHandler, errorMessage }) {
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
    <main className="flex h-screen w-screen min-w-[theme(width.80)] flex-col items-center justify-center gap-4">
      {/* Error message */}
      {errorMessage && (
        <div className="w-full break-words p-4 text-center text-red-700">
          {errorMessage.message ? errorMessage.message : errorMessage}
        </div>
      )}
      <h1 className="mb-4 text-center font-medium">
        Connect your wallet to access the dashboard.
      </h1>
      {/* Button to connect wallet using MetaMask */}
      <Button onClick={connectionHandler} variant="large">
        Connect Wallet
      </Button>
    </main>
  );
}

export default ConnectWallet;
