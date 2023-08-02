// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function AddChild({
  contract,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  /**
   * Add a child to the contract.
   * @param event - Event that triggered the function.
   */
  const addChild = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `addChild` function on the contract.
    contract
      .addChild(event.target.childAddress.value, event.target.childName.value)
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  // Return AddChild component.
  return (
    <Modal
      title="Add Child"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      utils={utils}
    >
      {/* Add child form */}
      <form onSubmit={addChild} className="flex w-full flex-col gap-4">
        {/* Child wallet address */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Child wallet address <span className="text-red-500">*</span>
          </span>
          <input
            id="childAddress"
            type="text"
            placeholder="Enter the child wallet address"
            minLength={42}
            maxLength={42}
            spellCheck={false}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Child name */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Child name <span className="text-red-500">*</span>
          </span>
          <input
            id="childName"
            type="text"
            placeholder="Enter the child name"
            minLength={2}
            maxLength={30}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Submit button */}
        <Button type="submit" className="w-full">
          Add Child
        </Button>
      </form>
    </Modal>
  );
}

export default AddChild;
