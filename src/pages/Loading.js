// Icons
import { ReactComponent as IconLoading } from "../assets/icons/loading.svg";

function Loading() {
  // Return Loading component.
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <IconLoading className="animate-spin text-gray-400" />
      <h1 className="text-3xl font-bold text-gray-600">Loading...</h1>
    </div>
  );
}

export default Loading;
