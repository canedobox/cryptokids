import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Header from "../components/Header";
// Pages
import ErrorMessage from "../components/ErrorMessage";
// Modals
import SignUp from "../pages/modals/SignUp";

function WebsiteLayout({
  account,
  accountType,
  contract,
  connectionHandler,
  errorMessage,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variable to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);

  /***** METHODS *****/
  /**
   * Register a parent to the contract.
   * @param event - Event that triggered the function.
   */
  const registerParent = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `registerParent` function on the contract.
    contract
      .registerParent(event.target.parentName.value)
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          connectionHandler();
        });
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /***** REACT HOOKS *****/
  // Set useNavigate hook.
  const navigateTo = useNavigate();

  /**
   * Listen for changes to `accountType`.
   */
  useEffect(() => {
    // If user is not registered.
    if (accountType === "not-registered") {
      // Open sign up modal.
      utils.openModal(setIsModalOpened);
    }
    // If account type is "parent" or "child".
    else if (accountType === "parent" || accountType === "child") {
      // Navigate to dashboard.
      navigateTo("/dashboard");
    }
  }, [accountType]);

  // Return WebsiteLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-col">
      {/* Sign up modal */}
      <SignUp
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
        registerParent={registerParent}
        utils={utils}
      />

      {/* Header */}
      <Header
        account={account}
        connectionHandler={connectionHandler}
        utils={utils}
      />
      {/* Main */}
      <main
        className={twMerge(
          "flex flex-col items-center justify-center",
          "mt-16 min-h-[calc(theme(height.screen)-theme(width.16))] w-full p-4"
        )}
      >
        {/* Child route element */}
        <Outlet />
      </main>
      {/* Error message */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
}

export default WebsiteLayout;
