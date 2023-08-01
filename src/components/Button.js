import { twMerge } from "tailwind-merge";

function Button({ variant = "default", className, children, ...restProps }) {
  // Button variants.
  const variants = {
    default: twMerge(
      "flex h-10 w-fit flex-row items-center justify-center gap-2 px-4 py-2",
      "whitespace-nowrap rounded-lg border text-sm font-semibold uppercase",
      "border-primary-700 bg-primary-700 text-white",
      "hover:border-primary-600 hover:bg-primary-600",
      "active:border-primary-800 active:bg-primary-800"
    ),
    large: "h-12 text-base px-6",
    outline: "bg-transparent text-primary-700 hover:text-white",
    outlineGray: twMerge(
      "border-gray-500 bg-transparent text-current",
      "hover:border-gra-500 hover:bg-gray-500 hover:text-white"
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
    )
  };

  // Return Button component.
  return (
    <button
      className={twMerge(variants.default, variants[variant], className)}
      {...restProps}
    >
      {children}
    </button>
  );
}

export default Button;
