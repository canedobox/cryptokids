import { twMerge } from "tailwind-merge";
// Components
import Button from "./Button";
// Icons
import { ReactComponent as IconClose } from "../assets/icons/close.svg";

function Modal({
  title,
  formRef,
  isModalOpened,
  setIsModalOpened,
  closeModal,
  cta,
  utils,
  children
}) {
  // Return Home component.
  return (
    <>
      {/* Modal backdrop */}
      <div
        className={twMerge(
          "fixed inset-0 z-40 transition-all duration-300 ease-in-out",
          "flex min-w-[theme(width.80)] items-center justify-center xs:p-4",
          cta && "p-4",
          isModalOpened ? "visible bg-black/60" : "invisible"
        )}
      >
        {/* Modal */}
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
          className={twMerge(
            "z-50 transition-all duration-200 ease-in-out",
            "flex h-full w-full flex-col items-center justify-start",
            "overflow-hidden bg-white shadow-md",
            cta
              ? "h-fit w-fit min-w-[theme(width.80)] max-w-xl rounded-xl"
              : "xs:h-fit xs:w-fit xs:min-w-[theme(width.80)] xs:max-w-xl xs:rounded-xl",
            isModalOpened ? "scale-100 opacity-100" : "scale-90 opacity-0"
          )}
        >
          {/* Modal header */}
          <div
            className={twMerge(
              "flex w-full items-center justify-end",
              title && "justify-between border-b border-gray-200 p-2 pl-4"
            )}
          >
            {/* Header title */}
            {title && <h1 className="text-lg font-medium">{title}</h1>}
            {/* Button to close sidebar */}
            <Button
              onClick={
                closeModal
                  ? closeModal
                  : () => {
                      utils.closeModal(setIsModalOpened, formRef);
                    }
              }
              variant="icon"
              className={!title && "rounded-r-none rounded-t-none"}
            >
              <IconClose />
            </Button>
          </div>

          {/* Content */}
          <div
            className={twMerge(
              "flex w-full flex-col items-center justify-start p-4 pt-0",
              title && "pt-4"
            )}
          >
            {children}
          </div>

          {/* CTA */}
          {cta && (
            <div className="flex w-full flex-row items-center justify-end gap-4 bg-gray-200 p-4">
              {/* Cancel */}
              {cta.cancel && (
                <Button variant="outlineGray" onClick={cta.cancel.onClick}>
                  {cta.cancel.label}
                </Button>
              )}
              {/* Confirm */}
              {cta.confirm && (
                <Button onClick={cta.confirm.onClick}>
                  {cta.confirm.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Modal;
