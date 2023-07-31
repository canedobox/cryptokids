import { Outlet } from "react-router-dom";
// Components
import Sidebar from "../components/Sidebar";
// Pages
import Loading from "../pages/Loading";

function DashboardLayout({
  account,
  accountType,
  logout,
  isDataLoading,
  errorMessage
}) {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-row">
      {/* Sidebar */}
      <Sidebar accountType={accountType} logout={logout} />
      {/* Main */}
      <main className="box-border w-full pt-16 md:pl-72 md:pt-0">
        <section className="box-border flex w-full flex-col items-start justify-start p-4">
          {errorMessage && (
            <div className="break-words text-red-700">{errorMessage}</div>
          )}
          {/* Loading or child route element */}
          {isDataLoading ? <Loading /> : <Outlet />}
          <hr className="my-4 w-full" />
          <div>Account: {account}</div>
          <div>AccountType: {accountType}</div>
        </section>
      </main>
    </div>
  );
}

export default DashboardLayout;
