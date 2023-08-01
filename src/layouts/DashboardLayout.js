import { Outlet } from "react-router-dom";
// Components
import Sidebar from "../components/Sidebar";
import ErrorMessage from "../components/ErrorMessage";
// Pages
import Loading from "../pages/Loading";

function DashboardLayout({
  account,
  accountType,
  logout,
  isDataLoading,
  errorMessage,
  setErrorMessage
}) {
  // Return DashboardLayout component.
  return (
    <div className="flex min-w-[theme(width.80)] flex-row">
      {/* Sidebar */}
      <Sidebar accountType={accountType} logout={logout} />
      {/* Main */}
      <main className="box-border w-full pt-16 md:pl-72 md:pt-0">
        <section className="box-border flex w-full flex-col items-start justify-start">
          {/* Loading or child route element */}
          {isDataLoading ? <Loading /> : <Outlet />}
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
