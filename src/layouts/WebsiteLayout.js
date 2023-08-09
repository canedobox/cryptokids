import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Header from "../components/Header";
// Pages
import ErrorMessage from "../components/ErrorMessage";
// Modals
import SignUp from "../pages/modals/SignUp";

/**
 * Website layout.
 * @param {object} contract - Contract object.
 * @param {string} account - Account address.
 * @param {string} accountType - Account type.
 * @param {function} connectionHandler - Function to handle connection.
 * @param {string} errorMessage - Error message object.
 * @param {function} setErrorMessage - Function to set error message.
 * @param {object} utils - Utility functions object.
 */
function WebsiteLayout({
  contract,
  account,
  accountType,
  connectionHandler,
  errorMessage,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variable to control modal.
  const [isSignUpModalOpened, setIsSignUpModalOpened] = useState(false);
  // State variables to control loading indicator.
  const [isSignUpPending, setIsSignUpPending] = useState(false);

  /***** METHODS *****/
  /**
   * Register a parent to the contract.
   * @param event - Event that triggered the function.
   */
  const registerParent = (event) => {
    // Prevent default form submission.
    event.preventDefault();
    // Reset error message.
    setErrorMessage(null);
    // Start loading indicator.
    setIsSignUpPending(true);

    // Call the `registerParent` function on the contract.
    contract
      .registerParent(event.target.parentName.value)
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          connectionHandler();
          // Stop loading indicator.
          setIsSignUpPending(false);
        });
      })
      .catch((error) => {
        // Set error message.
        setErrorMessage(error);
        // Stop loading indicator.
        setIsSignUpPending(false);
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
      utils.openModal(setIsSignUpModalOpened);
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
        registerParent={registerParent}
        isModalOpened={isSignUpModalOpened}
        setIsModalOpened={setIsSignUpModalOpened}
        isSignUpPending={isSignUpPending}
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
          "mt-16 min-h-[calc(theme(height.screen)-theme(width.16))] w-full p-4",
          useLocation().pathname === "/" && "mt-0 p-0"
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
