import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";
import Logo from "./Logo";

function Header({ account, connectionHandler }) {
  // Return Header component.
  return (
    <header
      className={twMerge(
        "fixed inset-x-0 top-0 z-10",
        "flex h-16 min-h-[theme(width.16)] w-full min-w-[theme(width.80)] items-center justify-between px-2 ",
        "bg-white shadow-md"
      )}
    >
      {/* Link to homepage */}
      <Link
        to="/"
        className="flex h-full items-center justify-center gap-2 px-2"
      >
        <Logo />
      </Link>

      {/* Button to connect wallet using MetaMask */}
      <Button onClick={connectionHandler} className={account && "normal-case"}>
        {account ? (
          <span className="text-base">
            {`${account.slice(0, 4)}...${account.slice(38, 42)}`}
          </span>
        ) : (
          <>
            Connect<span className="hidden 2xs:block"> Wallet</span>
          </>
        )}
      </Button>
    </header>
  );
}

export default Header;
