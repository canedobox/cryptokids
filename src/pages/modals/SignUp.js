import { useRef } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function SignUp({
  registerParent,
  isModalOpened,
  setIsModalOpened,
  isSignUpPending,
  utils
}) {
  // Ref to the form.
  const formRef = useRef(null);

  // Return SignUp component.
  return (
    <Modal
      title="Sign up as a parent"
      formRef={formRef}
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeWithBackdrop={false}
      utils={utils}
    >
      {/* Sign up form */}
      <form
        ref={formRef}
        onSubmit={(event) => registerParent(event, formRef)}
        className="flex w-full flex-col gap-4"
      >
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
            spellCheck={false}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Sign up button */}
        <Button type="submit" className="w-full" inProgress={isSignUpPending}>
          Sign up
        </Button>
      </form>
    </Modal>
  );
}

export default SignUp;
