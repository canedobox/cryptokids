// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function SignUp({
  contract,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  /**
   * Register a parent to the contract.
   * @param event - Event that triggered the function.
   */
  const registerParent = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `registerParent` function on the contract.
    contract.registerParent(event.target.parentName.value).catch((error) => {
      setErrorMessage(error);
    });
  };

  // Return SignUp component.
  return (
    <Modal
      title="Sign up as a parent"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      utils={utils}
    >
      {/* Sign up form */}
      <form onSubmit={registerParent} className="flex w-full flex-col gap-4">
        {/* Parent name */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Name <span className="text-red-500">*</span>
          </span>
          <input
            id="parentName"
            type="text"
            placeholder="Enter your name"
            minLength={2}
            maxLength={30}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Sign up button */}
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </form>
    </Modal>
  );
}

export default SignUp;
