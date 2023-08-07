import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
// Components
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Avatar from "../../components/Avatar";
// Icons
import { ReactComponent as IconSave } from "../../assets/icons/save.svg";

function EditProfile({
  account,
  accountName,
  editProfile,
  isModalOpened,
  setIsModalOpened,
  isEditPending,
  utils
}) {
  /***** STATES *****/
  // State for profile name.
  const [profileName, setProfileName] = useState(null);

  // Ref to the form.
  const formRef = useRef(null);

  /***** REACT HOOKS *****/
  /**
   * Listen for changes to `isModalOpened`.
   */
  useEffect(() => {
    // If modal is opened.
    if (isModalOpened) {
      // Set profile name to account name.
      setProfileName(accountName);
    }
  }, [isModalOpened]);

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
        {/* Profile picture preview */}
        <div
          className={twMerge(
            "flex flex-row items-center justify-center gap-4 pb-4",
            "border-b border-gray-200"
          )}
        >
          {/* Avatar */}
          <Avatar
            seed={utils.getAvatarSeed(account, profileName)}
            className="h-16 w-16"
          />
          <div className="flex flex-col items-start justify-center gap-2 text-gray-600">
            <p className="font-medium ">New name, new profile picture!</p>
            <p className="text-sm">&lt;&lt;&lt; Check the preview.</p>
          </div>
        </div>
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
            onChange={(event) => setProfileName(event.target.value)}
            required
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600"
          />
        </label>
        {/* Submit button */}
        <Button type="submit" className="w-full" inProgress={isEditPending}>
          <IconSave />
          Save Profile
        </Button>
      </form>
    </Modal>
  );
}

export default EditProfile;
