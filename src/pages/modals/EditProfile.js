import { useRef } from "react";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
// Icons
import { ReactComponent as IconSave } from "../../assets/icons/save.svg";

function EditProfile({
  accountName,
  editProfile,
  isModalOpened,
  setIsModalOpened,
  utils
}) {
  // Ref to the form.
  const formRef = useRef(null);

  // Return EditProfile component.
  return (
    <Modal
      title="Edit Profile"
      formRef={formRef}
      isModalOpened={isModalOpened}
      setIsModalOpened={setIsModalOpened}
      closeWithBackdrop={false}
      utils={utils}
    >
      {/* Edit profile form */}
      <form
        ref={formRef}
        onSubmit={(event) => editProfile(event, formRef)}
        className="flex w-full flex-col gap-4"
      >
        {/* Profile name */}
        <label className="flex w-full flex-col items-start gap-1">
          <span className="font-medium text-gray-600">
            Name <span className="text-red-500">*</span>
          </span>
          <input
            id="profileName"
            type="text"
            defaultValue={accountName}
            placeholder="Enter your name"
            minLength={2}
            maxLength={30}
            spellCheck={false}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Save button */}
        <Button type="submit" className="w-full">
          <IconSave />
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}

export default EditProfile;
