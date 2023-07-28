import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function DashboardLayout({ logout, errorMessage }) {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-row">
      <Sidebar logout={logout} />
      <main className="mt-16 w-full p-4 md:ml-72 md:mt-0">
        {errorMessage && (
          <div className="break-words text-error-700">{errorMessage}</div>
        )}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
