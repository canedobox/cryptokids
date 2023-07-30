import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Header from "../components/Header";
import Modal from "../components/Modal";
// Pages
import SignUp from "../pages/forms/SignUp";

function WebsiteLayout({
  account,
  accountType,
  contract,
  connectionHandler,
  errorMessage,
  setErrorMessage
}) {
  /***** STATES *****/
  // State to check if the modal is opened.
  const [isModalOpened, setIsModalOpened] = useState(false);

  /***** UTILS *****/
  // Set useNavigate hook.
  const navigateTo = useNavigate();

  /**
   * Open modal.
   */
  const openModal = () => {
    // Disable body scrollbars.
    document.body.classList.add("overflow-hidden");

    // Open modal.
    setIsModalOpened(true);
  };

  /**
   * Listen for changes to `accountType`.
   */
  useEffect(() => {
    // If user is not registered.
    if (accountType === "not-registered") {
      // Show sign up form.
      openModal();
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
      {/* Modal */}
      <Modal
        title="Sign up as a parent"
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
      >
        <SignUp contract={contract} setErrorMessage={setErrorMessage} />
      </Modal>
      {/* Header */}
      <Header account={account} connectionHandler={connectionHandler} />
      {/* Main */}
      <main
        className={twMerge(
          "flex flex-col items-center justify-center",
          "mt-16 min-h-[calc(theme(height.screen)-theme(width.16))] w-full p-4"
        )}
      >
        {/* Error message */}
        {errorMessage && (
          <div className="w-full break-words p-4 text-red-700">
            {errorMessage.message.toString()}
          </div>
        )}
        {/* Child route element */}
        <Outlet />
      </main>
    </div>
  );
}

export default WebsiteLayout;
