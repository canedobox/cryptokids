import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";
import Logo from "./Logo";
import Avatar from "./Avatar";
// Modals
import EditProfile from "../pages/modals/EditProfile";
import AccountSettings from "../pages/modals/AccountSettings";
import DeleteParent from "../pages/modals/DeleteParent";
// Icons
import { ReactComponent as IconMenu } from "../assets/icons/menu.svg";
import { ReactComponent as IconClose } from "../assets/icons/close.svg";
import { ReactComponent as IconFamilyGroup } from "../assets/icons/family-group.svg";
import { ReactComponent as IconTasks } from "../assets/icons/tasks.svg";
import { ReactComponent as IconRewards } from "../assets/icons/rewards.svg";
import { ReactComponent as IconMarketplace } from "../assets/icons/marketplace.svg";
import { ReactComponent as IconEdit } from "../assets/icons/edit-20.svg";
import { ReactComponent as IconSettings } from "../assets/icons/account-settings.svg";
import { ReactComponent as IconLogout } from "../assets/icons/logout.svg";

function Sidebar({
  contract,
  account,
  accountType,
  accountName,
  accountBalance,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State to check if the sidebar is opened.
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  // State variables to control modal.
  const [isEditProfileModalOpened, setIsEditProfileModalOpened] =
    useState(false);
  const [isAccountSettingsModalOpened, setIsAccountSettingsModalOpened] =
    useState(false);
  const [isDeleteParentModalOpened, setIsDeleteParentModalOpened] =
    useState(false);
  // State variables to control loading indicator.
  const [isEditPending, setIsEditPending] = useState(false);
  const [isDeletePending, setIsDeletePending] = useState(false);

  /***** VARIABLES *****/
  const navLinkVariants = {
    default: twMerge(
      "flex w-full items-center justify-start gap-4 whitespace-nowrap p-4",
      "rounded-lg font-semibold text-primary-200",
      "hover:bg-primary-500 hover:text-white active:bg-primary-600"
    ),
    active: "bg-primary-600 text-white"
  };

  /***** METHODS *****/
  /**
   * Open sidebar.
   */
  const openSidebar = () => {
    // Disable body scrollbars.
    document.body.classList.add("max-md:overflow-hidden");

    // Toggle sidebar state.
    setIsSidebarOpened(true);
  };

  /**
   * Close sidebar.
   */
  const closeSidebar = () => {
    // Enable body scrollbars.
    document.body.classList.remove("max-md:overflow-hidden");

    // Toggle sidebar state.
    setIsSidebarOpened(false);
  };

  /**
   * Edit a profile in the contract.
   * @param event - Event that triggered the function.
   * @param formRef - Form reference.
   */
  const editProfile = (event, formRef) => {
    // Prevent default form submission.
    event.preventDefault();
    // Reset error message.
    setErrorMessage(null);
    // Start loading indicator.
    setIsEditPending(true);

    // Call the `registerParent` function on the contract.
    contract
      .editProfile(event.target.profileName.value)
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          // Sync profile data.
          utils.syncProfile();
          // Close modal.
          utils.closeModal(setIsEditProfileModalOpened, formRef);
          // Stop loading indicator.
          setIsEditPending(false);
        });
      })
      .catch((error) => {
        // Set error message.
        setErrorMessage(error);
        // Stop loading indicator.
        setIsEditPending(false);
      });
  };

  /**
   * Delete parent account from the contract.
   */
  const deleteParent = () => {
    // Reset error message.
    setErrorMessage(null);
    // Start loading indicator.
    setIsDeletePending(true);

    // Call the `deleteTask` function on the contract.
    contract
      .deleteParent()
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.logout();
          // Stop loading indicator.
          setIsDeletePending(false);
        });
      })
      .catch((error) => {
        // Set error message.
        setErrorMessage(error);
        // Stop loading indicator.
        setIsDeletePending(false);
      });
  };

  // Return Sidebar component.
  return (
    <>
      {/* Edit profile modal */}
      <EditProfile
        account={account}
        accountName={accountName}
        editProfile={editProfile}
        isModalOpened={isEditProfileModalOpened}
        setIsModalOpened={setIsEditProfileModalOpened}
        isEditPending={isEditPending}
        utils={utils}
      />
      {/* Parent only */}
      {accountType === "parent" && (
        <>
          {/* Account settings modal */}
          <AccountSettings
            isModalOpened={isAccountSettingsModalOpened}
            setIsModalOpened={setIsAccountSettingsModalOpened}
            confirmModal={setIsDeleteParentModalOpened}
            utils={utils}
          />
          {/* Delete parent nodal */}
          <DeleteParent
            deleteParent={deleteParent}
            isModalOpened={isDeleteParentModalOpened}
            setIsModalOpened={setIsDeleteParentModalOpened}
            isDeletePending={isDeletePending}
            utils={utils}
          />
        </>
      )}

      {/* Header */}
      <header
        className={twMerge(
          "fixed inset-x-0 top-0 z-10",
          "flex h-16 min-h-[theme(width.16)] w-full min-w-[theme(width.80)] items-center justify-start px-2",
          "bg-primary-700 text-white shadow-md",
          "md:hidden"
        )}
      >
        {/* Button to open sidebar */}
        <Button onClick={openSidebar} variant="iconSidebar">
          <IconMenu />
        </Button>

        {/* Link to dashboard homepage */}
        <Link
          to="/dashboard"
          className="flex h-full items-center justify-center gap-2 px-2"
        >
          <Logo />
        </Link>
      </header>

      <aside>
        {/* Sidebar */}
        <div
          className={twMerge(
            "fixed inset-y-0 left-0 z-30 -translate-x-full transition-all duration-300 ease-in-out",
            "flex h-screen w-72 min-w-[theme(width.72)] flex-col items-start justify-start overflow-auto px-2",
            "bg-primary-700 text-white",
            "md:translate-x-0 md:shadow-none",
            isSidebarOpened && "translate-x-0 shadow-md"
          )}
        >
          {/* Sidebar header */}
          <div className="flex h-16 min-h-[theme(width.16)] w-full items-center justify-between ">
            {/* Link to dashboard homepage */}
            <Link
              to="/dashboard"
              onClick={closeSidebar}
              className="flex h-full items-center justify-center gap-3 px-3"
            >
              <Logo />
            </Link>

            {/* Button to close sidebar */}
            <Button
              onClick={closeSidebar}
              variant="iconSidebar"
              className="md:hidden"
            >
              <IconClose />
            </Button>
          </div>

          {/* Sidebar navigation */}
          <nav className="flex h-full w-full flex-col gap-2 border-y border-primary-600 py-2">
            {/* Family group navigation link */}
            {accountType === "parent" && (
              <NavLink
                to="/dashboard/family-group"
                onClick={closeSidebar}
                className={({ isActive }) => {
                  return twMerge(
                    navLinkVariants.default,
                    isActive && navLinkVariants.active
                  );
                }}
              >
                <IconFamilyGroup />
                Family Group
              </NavLink>
            )}

            {/* Tasks navigation link */}
            <NavLink
              to="/dashboard/tasks"
              onClick={closeSidebar}
              className={({ isActive }) => {
                return twMerge(
                  navLinkVariants.default,
                  isActive && navLinkVariants.active
                );
              }}
            >
              <IconTasks />
              Tasks
            </NavLink>

            {/* Rewards navigation link */}
            <NavLink
              to="/dashboard/rewards"
              onClick={closeSidebar}
              className={({ isActive }) => {
                return twMerge(
                  navLinkVariants.default,
                  isActive && navLinkVariants.active
                );
              }}
            >
              <IconRewards />
              Rewards
            </NavLink>

            {/* Marketplace navigation link */}
            {accountType === "child" && (
              <NavLink
                to="/dashboard/marketplace"
                onClick={closeSidebar}
                className={({ isActive }) => {
                  return twMerge(
                    navLinkVariants.default,
                    isActive && navLinkVariants.active
                  );
                }}
              >
                <IconMarketplace />
                Marketplace
              </NavLink>
            )}
          </nav>

          {/* User profile info */}
          <div className="flex w-full flex-col gap-2 py-2">
            {/* Profile */}
            <div
              className={twMerge(
                "box-border flex w-full flex-col gap-2 p-4",
                "border-b border-primary-600 text-primary-200"
              )}
            >
              <div className="flex w-full flex-row gap-4">
                {/* Avatar */}
                <Avatar
                  seed={utils.getAvatarSeed(account)}
                  className="h-10 w-10 border-2 border-primary-600"
                />
                {/* Account Info */}
                <div className="flex flex-col overflow-hidden">
                  {/* Name */}
                  <div
                    onClick={() => {
                      utils.openModal(setIsEditProfileModalOpened);
                    }}
                    className={twMerge(
                      "flex w-fit flex-row items-center gap-2 break-words",
                      "cursor-pointer border-b border-transparent font-semibold",
                      "hover:border-white hover:text-white active:text-white"
                    )}
                  >
                    {accountName}
                    <IconEdit className="min-h-fit min-w-fit" />
                  </div>
                  {/* Account */}
                  <p className="line-clamp-2 w-full break-words text-sm">
                    {account}
                  </p>
                </div>
              </div>
              {/* Balance, only child */}
              {accountType === "child" && (
                <div
                  className={twMerge(
                    "flex h-8 w-full flex-row items-center justify-center gap-2 px-2 py-2 text-center",
                    "whitespace-nowrap rounded-lg border text-sm font-semibold uppercase",
                    "border-primary-600"
                  )}
                >
                  {/* Account balance */}
                  <p className="w-full whitespace-nowrap">
                    <b>Balance: </b>
                    {utils.addTokenSymbol(accountBalance)}
                  </p>
                </div>
              )}
            </div>
            {/* Account settings link, parent only */}
            {accountType === "parent" && (
              <Link
                onClick={(event) => {
                  event.preventDefault();
                  utils.openModal(setIsAccountSettingsModalOpened);
                }}
                className={twMerge(navLinkVariants.default)}
              >
                <IconSettings />
                Account Settings
              </Link>
            )}
            {/* Logout link */}
            <Link
              to="/"
              onClick={() => {
                closeSidebar();
                utils.logout();
              }}
              className={twMerge(navLinkVariants.default)}
            >
              <IconLogout />
              Logout
            </Link>
          </div>
        </div>

        {/* Sidebar backdrop */}
        <div
          onClick={closeSidebar}
          className={twMerge(
            "fixed inset-0 z-20 transition-all duration-200 ease-in-out",
            "md:hidden",
            isSidebarOpened ? "visible bg-black/60" : "invisible"
          )}
        ></div>
      </aside>
    </>
  );
}

export default Sidebar;
