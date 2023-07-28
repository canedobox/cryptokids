import { Outlet } from "react-router-dom";

import Header from "../components/Header";

function WebsiteLayout({ account, connectionHandler, errorMessage }) {
  // Return WebsiteLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-col">
      <Header account={account} connectionHandler={connectionHandler} />
      <main className="mt-16 w-full p-4">
        {errorMessage && (
          <div className="break-words text-error-700">{errorMessage}</div>
        )}
        <Outlet />
      </main>
    </div>
  );
}

export default WebsiteLayout;
