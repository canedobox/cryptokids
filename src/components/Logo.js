// SVGs
import { ReactComponent as LogoText } from "../assets/logo.svg";
import { ReactComponent as LogoIcon } from "../assets/logo-icon.svg";

function Logo({
  hideIcon = false,
  hideLogo = false,
  iconWidth = "32",
  iconHeight = "32",
  logoWidth = "100",
  logoHeight = "24",
  variant = "darkBg"
}) {
  // Logo variants.
  const variants = {
    darkBg: { iconColor: "text-accent-400", logoColor: "text-white" },
    lightBg: { iconColor: "text-primary-700", logoColor: "text-gray-900" },
    white: { iconColor: "text-white", logoColor: "text-white" },
    black: { iconColor: "text-black", logoColor: "text-black" }
  };

  // Return Logo component.
  return (
    <>
      {/* Logo icon */}
      {!hideIcon && (
        <LogoIcon
          width={iconWidth}
          height={iconHeight}
          className={`${variants[variant].iconColor}`}
        />
      )}
      {/* Logo */}
      {!hideLogo && (
        <LogoText
          width={logoWidth}
          height={logoHeight}
          className={`${variants[variant].logoColor}`}
        />
      )}
    </>
  );
}

export default Logo;
