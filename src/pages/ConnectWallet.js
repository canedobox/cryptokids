import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// Components
import Button from "../components/Button";
import Logo from "../components/Logo";
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
      <main className="flex h-screen w-screen min-w-[theme(width.80)] flex-col items-center justify-center gap-10">
        {/* Logo */}
        <div className="flex flex-row items-center justify-center gap-4">
          <Logo
            iconHeight="48"
            iconWidth="48"
            logoHeight="38"
            logoWidth="160"
            variant="lightBg"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-4">
          {/* Message */}
          <h1 className="text-center font-medium">
            Connect your wallet to access the dashboard.
          </h1>
          {/* Button to connect wallet using MetaMask */}
          <Button onClick={connectionHandler} variant="large" className="w-60">
            Connect Wallet
          </Button>
          {/* Link to homepage */}
          <Link to="/">
            <Button variant="outlineGray" className="w-60">
              GO TO HOMEPAGE
            </Button>
          </Link>
        </div>
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
