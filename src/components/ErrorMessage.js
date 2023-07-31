import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";

function ErrorMessage({ errorMessage, setErrorMessage }) {
  // Variables
  let errorMessageReason;
  let errorMessage_;

  /**
   * Clear error message.
   */
  const clearErrorMessage = () => {
    setErrorMessage(null);
    errorMessageReason = null;
    errorMessage_ = null;
  };

  // Check if errorMessage is not null.
  if (errorMessage) {
    // Check if errorMessage is an object or string.
    if (typeof errorMessage === "object") {
      errorMessageReason = `Error: ${errorMessage.reason}.`;
      errorMessage_ = `Detailed error message: ${errorMessage.message}`;
    } else {
      errorMessageReason = errorMessage;
    }
  }

  // Return ErrorMessage component.
  return (
    <div
      className={twMerge(
        "fixed inset-x-0 bottom-0 z-50 translate-y-full transition-all duration-300 ease-in-out",
        "flex h-fit min-w-[theme(width.80)] flex-col items-center justify-start p-4",
        errorMessage && "translate-y-0"
      )}
    >
      {/* If error message exists */}
      {errorMessage && (
        <div
          className={twMerge(
            "flex max-w-2xl flex-col items-end",
            errorMessage_ && "w-full"
          )}
        >
          {/* Button to clear error message */}
          <Button variant="clearErrorMessage" onClick={clearErrorMessage}>
            CLEAR
          </Button>

          {/* Error message */}
          <div
            className={twMerge(
              "flex w-fit max-w-full flex-col gap-2 p-4",
              "border-red-700 bg-red-100 text-red-700",
              "overflow-hidden rounded-xl rounded-tr-none border shadow-md"
            )}
          >
            {/* Error message reason */}
            {errorMessageReason && (
              <div className={errorMessage_ && "font-bold"}>
                {errorMessageReason}
              </div>
            )}

            {/* Detail error message */}
            {errorMessage_ && (
              <div className="max-h-48 overflow-y-auto break-words rounded-lg bg-red-200 p-2 text-sm">
                {errorMessage_}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ErrorMessage;
