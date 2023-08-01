import Button from "../../components/Button";

function AddChild({ contract, setErrorMessage }) {
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
    <form onSubmit={addChild} className="flex w-full flex-col gap-4">
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
      <Button type="submit" className="w-full">
        Add Child
      </Button>
    </form>
  );
}

export default AddChild;
