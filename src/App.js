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
  const [accountName, setAccountName] = useState(null);
  const [accountBalance, setAccountBalance] = useState(0);
  // Contract
  const [contract, setContract] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
  // Utils
  const [isDashboardLoading, setIsDashboardLoading] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // Family Group
  const [familyGroup, setFamilyGroup] = useState([]);
  // Tasks
  const [allTasks, setAllTasks] = useState([]);
  // Rewards
  const [allRewards, setAllRewards] = useState([]);

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
          // Initialize the application.
          appInit();
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
    setAccountName(null);
    setAccountBalance(0);
    // Contract
    setContract(null);
    setTokenSymbol(null);
    setTokenDecimals(null);
    // Utils
    setIsDashboardLoading(null);
    setIsDataLoading(null);
    setErrorMessage(null);

    // Reset data.
    resetData();
  };

  /******************/
  /***** CONFIG *****/
  /******************/

  /**
   * Initialize the application by establishing communication
   * with the contract and fetching initial data.
   */
  const appInit = async () => {
    // Start loading dashboard.
    setIsDashboardLoading(true);
    setErrorMessage(null);

    // Get provider.
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Get signer.
    const signer = provider.getSigner();

    // Get network.
    const network = await provider.getNetwork();
    // Check if the network is supported.
    if (!contractAddress[network.chainId]) {
      setErrorMessage(
        "Network not supported, connect to Sepolia test network instead."
      );
      // Stop loading dashboard.
      setIsDashboardLoading(false);
      return;
    }

    // Get contract.
    const contract_ = new ethers.Contract(
      contractAddress[network.chainId].address,
      contractAbi,
      signer
    );
    setContract(contract_);

    // Get token symbol.
    const tokenSymbol_ = await contract_.symbol().catch((error) => {
      setErrorMessage(error);
    });
    setTokenSymbol(tokenSymbol_);

    // Get token decimals.
    const tokenDecimals_ = await contract_.decimals().catch((error) => {
      setErrorMessage(error);
    });
    setTokenDecimals(tokenDecimals_);

    // Get profile.
    const profile = await contract_.getProfile().catch((error) => {
      setErrorMessage(error);
    });
    setAccountType(profile.accountType);
    setAccountName(profile.name);

    // Stop loading dashboard.
    setIsDashboardLoading(false);
  };

  /*************************/
  /***** CONTRACT DATA *****/
  /*************************/

  /**
   * Fetch data from the contract based on the user's account type:
   * parent or child.
   */
  const fetchData = async () => {
    // Start loading data.
    setIsDataLoading(true);
    // Reset data.
    resetData();
    setErrorMessage(null);

    // Check if user is a parent.
    if (contract && account && accountType === "parent") {
      // Get user's family group.
      const familyGroup_ = await contract.getFamilyGroup().catch((error) => {
        setErrorMessage(error);
      });
      setFamilyGroup(familyGroup_);
      // Get user's family group tasks.
      const tasks_ = await contract.getFamilyGroupTasks().catch((error) => {
        setErrorMessage(error);
      });
      // Store all tasks.
      setAllTasks(tasks_);
      // Get user's family group rewards.
      const rewards_ = await contract.getFamilyGroupRewards().catch((error) => {
        setErrorMessage(error);
      });
      // Store all rewards.
      setAllRewards(rewards_);
    }
    // Check if user is a child.
    else if (contract && account && accountType === "child") {
      // Get user's tasks.
      const tasks_ = await contract.getChildTasks().catch((error) => {
        setErrorMessage(error);
      });
      // Store all tasks.
      setAllTasks(tasks_);
      // Get user's rewards.
      const rewards_ = await contract.getChildRewards().catch((error) => {
        setErrorMessage(error);
      });
      // Store all rewards.
      setAllRewards(rewards_);
      // Get user's accountBalance.
      const accountBalance_ = await contract
        .balanceOf(account)
        .catch((error) => {
          setErrorMessage(error);
        });
      setAccountBalance(accountBalance_);
    }

    // Stop loading data.
    setIsDataLoading(false);
  };

  /**
   * Reset all data related to family groups, tasks, and rewards.
   */
  const resetData = () => {
    // Reset state values.http://localhost:3000/dashboard/tasks
    // Account
    setAccountBalance(0);
    // Family group
    setFamilyGroup([]);
    // Tasks
    setAllTasks([]);
    // Rewards
    setAllRewards([]);
  };

  /**
   * Sync profile data.
   */
  const syncProfile = async () => {
    if (contract) {
      // Get profile.
      const profile = await contract.getProfile().catch((error) => {
        setErrorMessage(error);
      });
      setAccountName(profile.name);
    }
  };

  /*****************/
  /***** UTILS *****/
  /*****************/

  /**
   * Open modal window.
   */
  const openModal = (setIsModalOpened) => {
    // Disable body scrollbars.
    document.body.classList.add("overflow-hidden");
    // Open modal.
    setIsModalOpened(true);
  };

  /**
   * Close modal.
   */
  const closeModal = (setIsModalOpened, formRef = null) => {
    // Enable body scrollbars.
    document.body.classList.remove("overflow-hidden");
    // Close modal.
    setIsModalOpened(false);
    // Check if form exists.
    if (formRef) {
      // Reset form.
      formRef.current.reset();
    }
  };

  /**
   * Get short address.
   * Example: 0x1234...5678
   */
  const getShortAddress = (address) => {
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4,
      address.length
    )}`;
  };

  /**
   * Get avatar seed based on the user's account type.
   * Example: name:Alice+address:0x1234...5678
   */
  const getAvatarSeed = (address, newName = null) => {
    // If a new name is provided, use it instead.
    if (newName) {
      return `name:${newName}_account:${address.toUpperCase()}`;
    }

    // Avatar seed.
    let avatarSeed = "";

    // Check if user is a parent.
    if (account === address) {
      avatarSeed = `name:${accountName}_account:${account.toUpperCase()}`;
    }
    // Check if user is a child.
    else {
      // Loop through family group.
      familyGroup.map((child) => {
        // Get the child's avatar seed.
        if (child.child.childAddress === address) {
          avatarSeed = `name:${
            child.child.name
          }_account:${child.child.childAddress.toUpperCase()}`;
        }
        return true;
      });
    }

    // Return avatar seed.
    return avatarSeed;
  };

  /**
   * Get family group options for select inputs.
   * Example: <option value="0x1234...5678">Alice</option>
   */
  const getFamilyGroupOptions = (withAddress = false) => {
    // Return family group options.
    return (
      <>
        {familyGroup &&
          familyGroup.length > 0 &&
          familyGroup.map((option, index) => {
            return (
              <option key={index} value={option.child.childAddress}>
                {/* Get only first name */}
                {`${option.child.name.split(" ")[0]} 
                ${
                  // Get short address
                  withAddress
                    ? ` - ${getShortAddress(option.child.childAddress)}`
                    : ""
                }`}
              </option>
            );
          })}
      </>
    );
  };

  /**
   * Converts a number to its equivalent value in Ether
   * using the contract decimals.
   * Example: 1 to 1000000000000000000
   * @param value - Number to be converted.
   */
  const numberToEther = (value) => {
    if (tokenDecimals) {
      return ethers.utils
        .parseUnits(value.toString(), tokenDecimals)
        .toString();
    }
  };

  /**
   * Converts a Ether value to its equivalent number
   * using the contract decimals.
   * Example: 1000000000000000000 to 1
   * @param value - Ether value to be converted.
   */
  const etherToNumber = (value) => {
    if (tokenDecimals) {
      return parseFloat(
        ethers.utils.formatUnits(value.toString(), tokenDecimals).toString()
      );
    }
  };

  /**
   * Add token symbol to a value.
   * Example: 1 to 1 CK
   */
  const addTokenSymbol = (value) => {
    return `${etherToNumber(value.toString())} ${tokenSymbol}`;
  };

  /**
   * Format a date to a readable format.
   * Making it easier for kids to understand.
   * @param {string} date - Date to be format.
   * @param {string} prefix - Prefix to be added to the date.
   * @returns {string} Formatted date.
   */
  const formatDate = (date, prefix) => {
    // Get current date.
    const startDate = new Date();
    // Get end date.
    const endDate = new Date(date);

    // Calculate the difference in days.
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = Math.ceil(
      differenceInTime / (1000 * 60 * 60 * 24)
    );

    // Formatted date.
    let formattedDate = "";

    // If the date is in the past, return the number of days and date.
    if (differenceInDays < -1) {
      const options = {
        day: "2-digit",
        month: "numeric",
        year: "numeric"
      };
      const fullDate = new Date(date).toLocaleDateString("en-GB", options);
      formattedDate = `${Math.abs(differenceInDays)} days ago, ${fullDate}`;
    }
    // If the date is yesterday.
    else if (differenceInDays === -1) {
      formattedDate = "yesterday";
    }
    // If the date is today.
    else if (differenceInDays === 0) {
      formattedDate = "today";
    }
    // If the date is in tomorrow.
    else if (differenceInDays === 1) {
      formattedDate = "tomorrow";
    }
    // If the date is in the next three days, return the day of the week.
    else if (differenceInDays > 1 && differenceInDays <= 3) {
      // return the day of the week
      const options = {
        weekday: "long"
      };
      const fullDate = new Date(date).toLocaleDateString("en-GB", options);
      formattedDate = `this ${fullDate}`;
    }
    // If is more than 3 days away, return the number of days and date.
    else if (differenceInDays > 3) {
      const options = {
        day: "2-digit",
        month: "numeric",
        year: "numeric"
      };
      const fullDate = new Date(date).toLocaleDateString("en-GB", options);
      formattedDate = `in ${Math.abs(differenceInDays)} days, ${fullDate}`;
    }

    // Return formatted date.
    return `${prefix} ${formattedDate}`;
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
      // Initialize the application.
      appInit();
    }
  }, [account]);

  /**
   * Listen for changes to `accountType`.
   */
  useEffect(() => {
    fetchData();
  }, [accountType]);

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
              utils={{ openModal, closeModal, getShortAddress }}
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
                isDashboardLoading ? (
                  <LoadingDashboard />
                ) : // If accountType is null or "not-registered".
                !accountType || accountType === "not-registered" ? (
                  <ConnectWallet
                    accountType={accountType}
                    connectionHandler={connectionHandler}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                  />
                ) : (
                  // If accountType is "parent" or "child".
                  <DashboardLayout
                    contract={contract}
                    account={account}
                    accountType={accountType}
                    accountName={accountName}
                    accountBalance={accountBalance}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    utils={{
                      openModal,
                      closeModal,
                      syncProfile,
                      getAvatarSeed,
                      getShortAddress,
                      addTokenSymbol,
                      logout
                    }}
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
                  familyGroup={familyGroup}
                  isDataLoading={isDataLoading}
                  setErrorMessage={setErrorMessage}
                  utils={{
                    openModal,
                    closeModal,
                    fetchData,
                    getShortAddress,
                    getAvatarSeed,
                    addTokenSymbol
                  }}
                />
              </ProtectedPage>
            }
          />
          {/* Tasks */}
          <Route
            path="tasks"
            element={
              <Tasks
                contract={contract}
                accountType={accountType}
                accountBalance={accountBalance}
                allTasks={allTasks}
                isDataLoading={isDataLoading}
                setErrorMessage={setErrorMessage}
                utils={{
                  openModal,
                  closeModal,
                  fetchData,
                  getShortAddress,
                  getAvatarSeed,
                  getFamilyGroupOptions,
                  numberToEther,
                  etherToNumber,
                  addTokenSymbol,
                  formatDate
                }}
              />
            }
          />
          {/* Rewards */}
          <Route
            path="rewards"
            element={
              <Rewards
                contract={contract}
                accountType={accountType}
                accountBalance={accountBalance}
                allRewards={allRewards}
                isDataLoading={isDataLoading}
                setErrorMessage={setErrorMessage}
                utils={{
                  openModal,
                  closeModal,
                  fetchData,
                  getShortAddress,
                  getFamilyGroupOptions,
                  getAvatarSeed,
                  numberToEther,
                  etherToNumber,
                  addTokenSymbol,
                  formatDate
                }}
              />
            }
          />
          {/* Marketplace */}
          <Route
            path="marketplace"
            element={
              <ProtectedPage accountType={accountType}>
                <Marketplace
                  contract={contract}
                  accountBalance={accountBalance}
                  allRewards={allRewards}
                  isDataLoading={isDataLoading}
                  setErrorMessage={setErrorMessage}
                  utils={{
                    fetchData,
                    etherToNumber,
                    addTokenSymbol
                  }}
                />
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
