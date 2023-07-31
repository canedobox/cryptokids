import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardHome({ accountType }) {
  // Set useNavigate hook.
  const navigateTo = useNavigate();

  /**
   * Redirect user to the appropriate dashboard page.
   */
  useEffect(() => {
    if (accountType === "parent") {
      navigateTo("/dashboard/family-group");
    } else if (accountType === "child") {
      navigateTo("/dashboard/tasks");
    } else {
      navigateTo("/dashboard");
    }
  });

  // Return DashboardHome component.
  return <h1 className="text-3xl font-bold">Redirecting...</h1>;
}

export default DashboardHome;
