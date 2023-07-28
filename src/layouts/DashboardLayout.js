import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

function DashboardLayout() {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.minWidth)] flex-row">
      <Sidebar />
      <main className="mt-16 w-full p-4 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
