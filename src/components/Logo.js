// SVGs
import { ReactComponent as LogoText } from "../assets/logo.svg";
import { ReactComponent as LogoIcon } from "../assets/logo-icon.svg";

/**
 * Logo component.
 * @param {boolean} hideIcon - Whether to hide logo icon.
 * @param {boolean} hideLogo - Whether to hide logo text.
 * @param {string} iconWidth - Logo icon width.
 * @param {string} iconHeight - Logo icon height.
 * @param {string} logoWidth - Logo text width.
 * @param {string} logoHeight - Logo text height.
 * @param {string} variant - Logo variant.
 */
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
