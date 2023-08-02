// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";

function AddReward({
  contract,
  isModalOpened,
  setIsModalOpened,
  setErrorMessage,
  utils
}) {
  /**
   * Add a reward to the contract.
   * @param event - Event that triggered the function.
   */
  const addChild = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Get the reward price.
    const rewardPrice = utils.numberToEther(event.target.rewardPrice.value);

    // Call the `addReward` function on the contract.
    contract
      .addReward(
        event.target.childAddress.value,
        event.target.rewardDescription.value,
        rewardPrice
      )
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  // Return AddReward component.
  return (
    <Modal
      title="Add Reward"
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      utils={utils}
    >
      <form onSubmit={addChild} className="flex w-full flex-col gap-4">
        {/* Child wallet address */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Assign to <span className="text-red-500">*</span>
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
        {/* Reward description */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Description <span className="text-red-500">*</span>
          </span>
          <input
            id="rewardDescription"
            type="text"
            placeholder="Enter the reward description"
            minLength={3}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Reward price */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Price (1 to 100) <span className="text-red-500">*</span>
          </span>
          <input
            id="rewardPrice"
            type="number"
            placeholder="Enter the reward price in CK"
            min={1}
            max={100}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Submit button */}
        <Button type="submit" className="w-full">
          Add Reward
        </Button>
      </form>
    </Modal>
  );
}

export default AddReward;
