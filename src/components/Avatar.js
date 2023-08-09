import { twMerge } from "tailwind-merge";

/**
 * Avatar component.
 * @param {string} seed - Seed to generate avatar.
 * @param {string} className - Tailwind classes.
 * @param {object} restProps - Rest of the props.
 */
function Avatar({ seed, className, ...restProps }) {
  // Create avatar using DiceBear API.
  let avatarURL = `https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${seed}`;
  avatarURL += "&mouth=bite,grill03,smile01,smile02,square01,diagram";

  // Return ChildCard component.
  return (
    <img
      alt=""
      src={avatarURL}
      className={twMerge("h-full w-full rounded-full", className)}
      {...restProps}
    />
  );
}

export default Avatar;
