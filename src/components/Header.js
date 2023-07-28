import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import Button from "./Button";
import Logo from "./Logo";

function Header() {
  /**
   * Connects to MetaMask and get user's account.
   */
  const connectionHandler = () => {
    // ...
  };

  // Return Header component.
  return (
    // Header topbar.
    <header
      className={twMerge(
        "absolute left-0 right-0 top-0 z-30",
        "flex h-16 min-h-[theme(width.16)] w-full min-w-[theme(width.minWidth)] items-center justify-between px-2 ",
        "bg-white shadow-sm"
      )}
    >
      {/* Link to homepage */}
      <Link
        to="/"
        className="flex h-full cursor-pointer items-center justify-center gap-2 px-2"
      >
        <Logo />
      </Link>

      {/* Button to connect wallet using MetaMask */}
      <Button onClick={connectionHandler}>
        Connect<span className="hidden xs:block"> Wallet</span>
      </Button>
    </header>
  );
}

export default Header;
