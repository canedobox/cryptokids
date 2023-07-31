import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ethers } from "ethers";
// Layouts
import WebsiteLayout from "./layouts/WebsiteLayout";
import DashboardLayout from "./layouts/DashboardLayout";
// Pages
import Home from "./pages/Home";
import LoadingDashboard from "./pages/LoadingDashboard";
import ConnectWallet from "./pages/ConnectWallet";
import DashboardHome from "./pages/DashboardHome";
import ProtectedPage from "./pages/ProtectedPage";
import FamilyGroup from "./pages/FamilyGroup";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import Marketplace from "./pages/Marketplace";
import PageNotFound from "./pages/PageNotFound";
// Contract files
import contractAddress from "./contracts/CryptoKids-address.json";
import contractAbi from "./contracts/CryptoKids-abi.json";

function App() {
  /***** STATES *****/
  // Account
  const [account, setAccount] = useState(null);
  const [accountType, setAccountType] = useState(null);
  // Contract
  const [contract, setContract] = useState(null);
  // Utils
  const [isLoading, setIsLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  /*******************************/
  /***** USER AUTHENTICATION *****/
  /*******************************/

  /**
   * Connects to MetaMask and get user's account.
   */
  const connectionHandler = async () => {
    // If account exists.
    if (account) {
      logout();
    }

    // Check if MetaMask is installed.
    if (window.ethereum && window.ethereum.isMetaMask) {
      // Connect using MetaMask and get account.
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          // Store account.
          setAccount(accounts[0]);
          // Reset some state values.
          setAccountType(null);
          setErrorMessage(null);
          // Initialize the page.
          pageInit();
        })
        .catch((error) => {
          setErrorMessage(error);
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
      connectionHandler();
    });
  }

  /**
   * User logout.
   */
  const logout = () => {
    // Reset state values.
    // Account
    setAccount(null);
    setAccountType(null);
    // Utils
    setErrorMessage(null);
  };

  /******************/
  /***** CONFIG *****/
  /******************/

  /**
   * Initialize the page by establishing communication
   * with the contract and fetching initial data.
   */
  const pageInit = async () => {
    // Start loading.
    setIsLoading(true);
    setErrorMessage(null);

    // Get provider.
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    // Get signer.
    let signer = provider.getSigner();

    // Get network.
    let network = await provider.getNetwork();
    // Check if the network is supported.
    if (!contractAddress[network.chainId]) {
      setErrorMessage(
        "Network not supported, connect to Sepolia test network instead."
      );
      // Stop loading.
      setIsLoading(false);
      return;
    }

    // Get contract.
    let contract_ = new ethers.Contract(
      contractAddress[network.chainId].address,
      contractAbi,
      signer
    );
    setContract(contract_);

    // Get profile.
    let profile = await contract_.getProfile().catch((error) => {
      setErrorMessage(error);
    });
    setAccountType(profile.accountType);

    // Stop loading.
    setIsLoading(false);
  };

  /***********************/
  /***** REACT HOOKS *****/
  /***********************/

  /**
   * Listen for changes to `account`.
   */
  useEffect(() => {
    // Check if MetaMask is installed and account exists.
    if (window.ethereum && window.ethereum.isMetaMask && account) {
      pageInit();
    }
  }, [account]);

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
              accountType={accountType}
              contract={contract}
              connectionHandler={connectionHandler}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          }
        >
          {/* Homepage */}
          <Route
            index
            element={<Home connectionHandler={connectionHandler} />}
          />
        </Route>

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={
            <>
              {
                // If dashboard is loading.
                isLoading ? (
                  <LoadingDashboard />
                ) : // If accountType is null or "not-registered".
                !accountType || accountType === "not-registered" ? (
                  <ConnectWallet
                    accountType={accountType}
                    connectionHandler={connectionHandler}
                    errorMessage={errorMessage}
                  />
                ) : (
                  // If accountType is "parent" or "child".
                  <DashboardLayout
                    account={account}
                    accountType={accountType}
                    logout={logout}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                  />
                )
              }
            </>
          }
        >
          {/* Dashboard homepage */}
          <Route index element={<DashboardHome accountType={accountType} />} />
          {/* Family group */}
          <Route
            path="family-group"
            element={
              <ProtectedPage accountType={accountType}>
                <FamilyGroup
                  contract={contract}
                  setErrorMessage={setErrorMessage}
                />
              </ProtectedPage>
            }
          />
          {/* Tasks */}
          <Route path="tasks" element={<Tasks />} />
          {/* Rewards */}
          <Route path="rewards" element={<Rewards />} />
          {/* Marketplace */}
          <Route
            path="marketplace"
            element={
              <ProtectedPage accountType={accountType}>
                <Marketplace />
              </ProtectedPage>
            }
          />
        </Route>

        {/* Page not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
