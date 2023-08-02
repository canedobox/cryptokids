import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";

function PageHeader({ title, filterChild = true, cta }) {
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
      {cta && (
        <div className="flex flex-row items-center gap-4 text-sm">
          {/* CTA button */}
          <Button onClick={cta.onClick} variant="small">
            {cta.label}
          </Button>
        </div>
      )}
    </header>
  );
}

export default PageHeader;
