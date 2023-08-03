import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";

function PageHeader({ title, accountBalance, filterChild = true, cta, utils }) {
  // Return PageHeader component.
  return (
    <header
      className={twMerge(
        "flex flex-row items-center justify-between",
        "h-16 min-h-[theme(width.16)] w-full p-4 ",
        "border-b border-gray-200 bg-white"
      )}
    >
      {/* Title */}
      <h1 className="text-xl font-medium">{title}</h1>
      {/* CTA */}
      <div className="flex flex-row items-center justify-end gap-4">
        {/* CTA Button */}
        {cta && (
          <div className="flex flex-row items-center gap-4 text-sm">
            <Button onClick={cta.onClick}>{cta.label}</Button>
          </div>
        )}
        {/* Account balance */}
        {accountBalance && (
          <div
            className={twMerge(
              "flex h-8 w-fit flex-row items-center justify-center gap-2 px-2 py-2",
              "whitespace-nowrap rounded-lg border text-sm font-semibold uppercase",
              "border-gray-200 text-gray-600 md:hidden"
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
    </header>
  );
}

export default PageHeader;
