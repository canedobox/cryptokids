import { twMerge } from "tailwind-merge";

function Button({
  children,
  onClick,
  isRounded = true,
  isCircle = false,
  isDisabled = false,
  variant = "default",
  className
}) {
  // Button variants.
  const variants = {
    default:
      "bg-primary-700 text-white px-4 py-2 font-semibold flex gap-2 whitespace-nowrap",
    icon: "bg-transparent text-current p-3 hover:bg-gray-200",
    iconSidebar: "bg-transparent p-3 text-white hover:bg-primary-500",
    isRounded: "rounded-2xl",
    isCircle: "rounded-full",
    isDisabled: "opacity-70"
  };

  // Return Button component.
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={twMerge(
        variants.default,
        variants[variant],
        isRounded && variants.isRounded,
        isCircle && variants.isCircle,
        isDisabled && variants.isDisabled,
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
