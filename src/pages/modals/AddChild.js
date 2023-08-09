import { useRef } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconAdd } from "../../assets/icons/add.svg";

/**
 * Add child modal.
 * @param {object} selectedChild - Selected child object.
 * @param {function} deselectChild - Function to deselect child.
 * @param {function} addChild - Function to add child.
 * @param {boolean} isModalOpened - Is modal opened state.
 * @param {function} setIsModalOpened - Function to set is modal opened state.
 * @param {boolean} isAddPending - If true, display loading indicator.
 * @param {object} utils - Utility functions object.
 */
function AddChild({
  selectedChild,
  deselectChild,
  addChild,
  isModalOpened,
  setIsModalOpened,
  isAddPending,
  utils
}) {
  // Ref to the form.
  const formRef = useRef(null);

  // Return AddChild component.
  return (
    <Modal
      title="Add Child"
      formRef={formRef}
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeModal={selectedChild && (() => deselectChild(formRef))}
      closeWithBackdrop={false}
      utils={utils}
    >
      {/* Add child form */}
      <form
        ref={formRef}
        onSubmit={(event) => addChild(event, formRef)}
        className="flex w-full flex-col gap-4"
      >
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
            spellCheck={false}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Submit button */}
        <Button type="submit" className="w-full" inProgress={isAddPending}>
          <IconAdd />
          Add Child
        </Button>
      </form>
    </Modal>
  );
}

export default AddChild;
