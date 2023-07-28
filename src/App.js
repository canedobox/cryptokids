import { BrowserRouter, Route, Routes } from "react-router-dom";

import WebsiteLayout from "./layouts/WebsiteLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import FamilyGroup from "./pages/FamilyGroup";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import Marketplace from "./pages/Marketplace";
import PageNotFound from "./pages/PageNotFound";
import { useState } from "react";

function App() {
  /***** STATES *****/
  // Account
  const [account, setAccount] = useState(null);
  // Utils
  const [errorMessage, setErrorMessage] = useState(null);

  /*******************************/
  /***** USER AUTHENTICATION *****/
  /*******************************/

  /**
   * Connects to MetaMask and get user's account.
   */
  const connectionHandler = async () => {
    // Check if MetaMask is installed.
    if (window.ethereum && window.ethereum.isMetaMask) {
      // Connect using MetaMask and get account.
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          // Store account.
          setAccount(accounts[0]);
          setErrorMessage(null);
        })
        .catch((error) => {
          setErrorMessage(error.message);
          setAccount(null);
        });
    }
    // If MetaMask is not installed.
    else {
      setErrorMessage("Please, install MetaMask.");
      setAccount(null);
    }
  };

  // Check if MetaMask is installed.
  if (window.ethereum && window.ethereum.isMetaMask) {
    //Set up an event listener for when the account changes on MetaMask.
    window.ethereum.on("accountsChanged", async () => {
      logout();
      connectionHandler();
    });
  }

  /**
   * User logout.
   */
  const logout = () => {
    setAccount(null);
    setErrorMessage(null);
  };

  // Return App component.
  return (
    <BrowserRouter>
      <Routes>
        {/* Website */}
        <Route
          path="/"
          element={
            <WebsiteLayout
              account={account}
              connectionHandler={connectionHandler}
              errorMessage={errorMessage}
            />
          }
        >
          <Route index element={<Home />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        {/* Dashboard */}
        <Route
          path="dashboard"
          element={
            <DashboardLayout logout={logout} errorMessage={errorMessage} />
          }
        >
          <Route index element={<FamilyGroup />} />
          <Route path="family-group" element={<FamilyGroup />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Route>
        {/* Page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
