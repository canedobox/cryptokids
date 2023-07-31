import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";
import Logo from "./Logo";
// Icons
import { ReactComponent as IconMenu } from "../assets/icons/menu.svg";
import { ReactComponent as IconClose } from "../assets/icons/close.svg";
import { ReactComponent as IconFamilyGroup } from "../assets/icons/family-group.svg";
import { ReactComponent as IconTasks } from "../assets/icons/tasks.svg";
import { ReactComponent as IconRewards } from "../assets/icons/rewards.svg";
import { ReactComponent as IconMarketplace } from "../assets/icons/marketplace.svg";
import { ReactComponent as IconLogout } from "../assets/icons/logout.svg";

function Sidebar({ accountType, logout }) {
  // State to check if the sidebar is opened.
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);

  const navLinkVariants = {
    default: twMerge(
      "flex w-full items-center justify-start gap-4 whitespace-nowrap p-4",
      "rounded-lg font-semibold text-primary-200",
      "hover:bg-primary-500 hover:text-white active:bg-primary-600"
    ),
    active: "bg-primary-600 text-white"
  };

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

  // Return Sidebar component.
  return (
    <>
      {/* Header */}
      <header
        className={twMerge(
          "fixed inset-x-0 top-0 z-10",
          "flex h-16 min-h-[theme(width.16)] w-full min-w-[theme(width.80)] items-center justify-start px-2",
          "bg-white shadow-md",
          "md:hidden"
        )}
      >
        {/* Button to open sidebar */}
        <Button onClick={openSidebar} variant="icon" className="md:hidden">
          <IconMenu />
        </Button>

        {/* Link to dashboard homepage */}
        <Link
          to="/dashboard"
          className="flex h-full  items-center justify-center gap-2 px-2"
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
              <Logo variant="sidebar" />
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
            {/* Logout link */}
            <Link
              to="/"
              onClick={() => {
                closeSidebar();
                logout();
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
