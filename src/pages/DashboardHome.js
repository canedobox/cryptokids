import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard homepage.
 * @param {string} accountType - Account type.
 */
function DashboardHome({ accountType }) {
  /***** REACT HOOKS *****/
  // Set useNavigate hook.
  const navigateTo = useNavigate();

  /**
   * Redirect user to the appropriate dashboard page.
   */
  useEffect(() => {
    // If account type is "parent", redirect to family group page.
    if (accountType === "parent") {
      navigateTo("/dashboard/family-group");
    }
    // If account type is "child", redirect to tasks page.
    else if (accountType === "child") {
      navigateTo("/dashboard/tasks");
    }
    // If account type is "not-registered", redirect to dashboard homepage.
    else {
      navigateTo("/dashboard");
    }
  });

  // Return DashboardHome component.
  return <h1 className="text-3xl font-bold text-gray-600">Redirecting...</h1>;
}

export default DashboardHome;
