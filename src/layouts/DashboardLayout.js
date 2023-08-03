import { Outlet } from "react-router-dom";
// Components
import Sidebar from "../components/Sidebar";
import ErrorMessage from "../components/ErrorMessage";
// Pages
import Button from "../components/Button";

function DashboardLayout({
  account,
  accountType,
  logout,
  errorMessage,
  setErrorMessage,
  utils
}) {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-row">
      {/* Sidebar */}
      <Sidebar accountType={accountType} logout={logout} />
      {/* Main */}
      <main className="box-border min-h-screen w-full pt-16 md:pl-72 md:pt-0">
        <section className="box-border flex h-full w-full flex-col items-start justify-start">
          <Outlet />
        </section>
      </main>
      {/* Error message */}
      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
}

export default DashboardLayout;
