import { Navigate, useLocation } from "react-router-dom";

const ProtectedPage = ({ accountType, children }) => {
  // List of pages a parent can access.
  const parentPages = ["family-group", "tasks", "rewards"];
  // List of pages a child can access.
  const childPages = ["tasks", "rewards", "marketplace"];

  // Get the current page from the URL.
  const location = useLocation();
  const currentPage = location.pathname.split("/")[2];

  // Check if user has access to the current page.
  if (
    (accountType === "parent" && parentPages.includes(currentPage)) ||
    (accountType === "child" && childPages.includes(currentPage))
  ) {
    // If user has access, render the page.
    return children;
  }

  // If user does not have access, redirect to the dashboard homepage.
  return <Navigate to="/dashboard" />;
};

export default ProtectedPage;
