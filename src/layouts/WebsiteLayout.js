import { Outlet } from "react-router-dom";

import Header from "../components/Header";

function WebsiteLayout() {
  // Return WebsiteLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-col">
      <Header />
      <main className="mt-16 w-full p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default WebsiteLayout;
