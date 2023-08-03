// Icons
import { ReactComponent as IconSync } from "../assets/icons/loading.svg";

function Loading() {
  // Return Loading component.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <IconSync className="animate-spin text-gray-400" />
      <h1 className="p-4 text-3xl font-bold">Loading...</h1>
    </div>
  );
}

export default Loading;
