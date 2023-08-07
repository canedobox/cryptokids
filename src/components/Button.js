import { twMerge } from "tailwind-merge";
// Icons
import { ReactComponent as IconProgress } from "../assets/icons/progress.svg";

function Button({
  variant = "default",
  className,
  children,
  inProgress = false,
  inProgressLabel = "",
  ...restProps
}) {
  // Button variants.
  const variants = {
    small: "h-8 px-2",
    large: "h-12 text-base px-6",
    default: twMerge(
      "flex h-10 w-fit flex-row items-center justify-center gap-2 px-4 py-2",
      "whitespace-nowrap rounded-lg border text-sm font-semibold uppercase",
      "border-primary-700 bg-primary-700 text-white",
      "hover:bg-primary-600 active:hover:border-primary-600",
      "active:border-primary-800 active:bg-primary-800",
      "disabled:cursor-not-allowed disabled:bg-primary-700 disabled:opacity-80"
    ),
    white: twMerge(
      "border-gray-100 bg-gray-100 text-primary-700",
      "hover:border-white hover:bg-white",
      "active:border-gray-100 active:bg-gray-100"
    ),
    outline: "bg-transparent text-primary-700 hover:text-white",
    outlineSmall: "bg-transparent text-primary-700 hover:text-white h-8 px-2",
    outlineWhite: twMerge(
      "border-gray-100 bg-transparent text-white",
      "hover:border-white hover:bg-white hover:text-primary-700",
      "active:border-gray-100 active:bg-gray-100"
    ),
    outlineGray: twMerge(
      "border-gray-500 bg-transparent text-current",
      "hover:border-gray-500 hover:bg-gray-500 hover:text-white",
      "active:border-gray-700 active:bg-gray-700 active:text-white"
    ),
    outlineRed: twMerge(
      "border-red-700 bg-transparent text-red-700",
      "hover:border-red-600 hover:bg-red-600 hover:text-white",
      "active:border-red-800 active:bg-red-800 active:text-white"
    ),
    clearErrorMessage: twMerge(
      "h-fit w-fit rounded-b-none border p-1 px-3 text-current",
      "border-red-700 bg-red-700 text-white",
      "hover:border-red-600 hover:bg-red-600",
      "active:border-red-800 active:bg-red-800"
    ),
    icon: twMerge(
      "h-fit w-fit border-none bg-transparent p-3 text-current",
      "hover:bg-gray-200 active:bg-gray-300"
    ),
    iconSidebar: twMerge(
      "h-fit w-fit border-none bg-transparent p-3 text-white",
      "hover:bg-primary-500 active:bg-primary-600"
    ),
    iconEdit: twMerge(
      "h-fit w-fit p-1 ",
      "border-gray-500 bg-transparent text-gray-500",
      "hover:border-gray-500 hover:bg-gray-500 hover:text-white",
      "active:border-gray-700 active:bg-gray-700 active:text-white"
    ),
    iconDelete: twMerge(
      "h-fit w-fit p-1 ",
      "border-red-700 bg-transparent text-red-700",
      "hover:border-red-600 hover:bg-red-600 hover:text-white",
      "active:border-red-800 active:bg-red-800 active:text-white"
    )
  };

  // Return Button component.
  return (
    <button
      className={twMerge(variants.default, variants[variant], className)}
      disabled={inProgress}
      {...restProps}
    >
      {inProgress ? (
        <>
          <IconProgress className="animate-spin" width="24" height="24" />
          {inProgressLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
