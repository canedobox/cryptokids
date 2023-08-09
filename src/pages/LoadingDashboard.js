// Icons
import { ReactComponent as IconLoading } from "../assets/icons/loading.svg";

/**
 * Loading dashboard page.
 */
function LoadingDashboard() {
  // Return LoadingDashboard component.
  return (
    <main className="flex h-screen w-screen min-w-[theme(width.80)] flex-col items-center justify-center gap-4">
      <IconLoading className="animate-spin text-gray-400" />
      <h1 className="text-3xl font-bold text-gray-600">Loading dashboard...</h1>
    </main>
  );
}

export default LoadingDashboard;
