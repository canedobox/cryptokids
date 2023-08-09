import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";
import Logo from "./Logo";
import { useState } from "react";

/**
 * Header component.
 * @param {object} account - Account address.
 * @param {function} connectionHandler - Function to handle connection.
 * @param {object} utils - Utility functions object.
 */
function Header({ account, connectionHandler, utils }) {
  /***** STATES *****/
  // State for scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  /***** METHODS *****/
  // Listener for scroll position.
  window.addEventListener("scroll", () => {
    setScrollPosition(window.scrollY);
  });

  // Return Header component.
  return (
    <header
      className={twMerge(
        "fixed inset-x-0 top-0 z-10",
        "flex h-16 min-h-[theme(width.16)] w-full min-w-[theme(width.80)] items-center justify-center px-2 ",
        "bg-white shadow-md",
        useLocation().pathname === "/" && "bg-transparent shadow-none",
        useLocation().pathname === "/" &&
          scrollPosition > 0 &&
          "bg-primary-700 shadow-md"
      )}
    >
      {/* Container */}
      <div className="flex w-full max-w-7xl flex-row items-center justify-between">
        {/* Link to homepage */}
        <Link
          to="/"
          className="flex h-full items-center justify-center gap-2 px-2"
        >
          <Logo
            variant={useLocation().pathname === "/" ? "darkBg" : "lightBg"}
          />
        </Link>

        {/* Button to connect wallet using MetaMask */}
        <Button
          onClick={connectionHandler}
          variant={useLocation().pathname === "/" ? "white" : "default"}
          className={account && "normal-case"}
        >
          {account ? (
            <span className="text-base">{utils.getShortAddress(account)}</span>
          ) : (
            <>
              Connect<span className="hidden 2xs:block"> Wallet</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}

export default Header;
