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
  const [tasksCounter, setTasksCounter] = useState(0);
  const [openTasks, setOpenTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [expiredTasks, setExpiredTasks] = useState([]);
  // Rewards
  const [rewardsCounter, setRewardsCounter] = useState(0);
  const [openRewards, setOpenRewards] = useState([]);
  const [purchasedRewards, setPurchasedRewards] = useState([]);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [approvedRewards, setApprovedRewards] = useState([]);

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
    console.log("fetchData");
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
      organizeTasks(tasks_);
      // Get user's family group rewards.
      const rewards_ = await contract.getFamilyGroupRewards().catch((error) => {
        setErrorMessage(error);
      });
      organizeRewards(rewards_);
    }
    // Check if user is a child.
    else if (contract && account && accountType === "child") {
      // Get user's tasks.
      const tasks_ = await contract.getChildTasks().catch((error) => {
        setErrorMessage(error);
      });
      organizeTasks(tasks_);
      // Get user's rewards.
      const rewards_ = await contract.getChildRewards().catch((error) => {
        setErrorMessage(error);
      });
      organizeRewards(rewards_);
      // Get user's accountBalance.
      const accountBalance_ = await contract
        .balanceOf(account)
        .catch((error) => {
          setErrorMessage(error);
        });
      setAccountBalance(etherToNumber(accountBalance_));
    }

    // Stop loading data.
    setIsDataLoading(false);
  };

  /**
   * Reset all data related to family groups, tasks, and rewards.
   */
  const resetData = () => {
    // Reset state values.
    // Account
    setAccountBalance(0);
    // Family group
    setFamilyGroup([]);
    // Tasks
    setTasksCounter(0);
    setOpenTasks([]);
    setCompletedTasks([]);
    setApprovedTasks([]);
    setExpiredTasks([]);
    // Rewards
    setRewardsCounter(0);
    setOpenRewards([]);
    setPurchasedRewards([]);
    setRedeemedRewards([]);
    setApprovedRewards([]);
  };

  /**
   * Organize tasks into different categories based on their status:
   * approved, completed, expired, or open.
   * @param tasks - An array of tasks.
   */
  const organizeTasks = (tasks) => {
    // Set tasks counter.
    setTasksCounter(tasks.length);
    // Loop through tasks.
    tasks.map((task) => {
      // Check if task was approved.
      if (task.approved) {
        setApprovedTasks((prevState) => [...prevState, task]);
      }
      // Check if task was completed.
      else if (task.completed) {
        setCompletedTasks((prevState) => [...prevState, task]);
      }
      // Check if task is expired.
      else if (
        task.dueDate > 0 &&
        task.dueDate < Math.floor(Date.now() / 1000)
      ) {
        setExpiredTasks((prevState) => [...prevState, task]);
      }
      // Task still open.
      else {
        setOpenTasks((prevState) => [...prevState, task]);
      }
      return true;
    });
  };

  /**
   * Organize rewards into different categories based on their status:
   * approved, redeemed, purchased, or open.
   * @param rewards - An array of rewards.
   */
  const organizeRewards = (rewards) => {
    // Set rewards counter.
    setRewardsCounter(rewards.length);
    // Loop through rewards.
    rewards.map((reward) => {
      // Check if reward was approved.
      if (reward.approved) {
        setApprovedRewards((prevState) => [...prevState, reward]);
      }
      // Check if reward was redeemed.
      else if (reward.redeemed) {
        setRedeemedRewards((prevState) => [...prevState, reward]);
      }
      // Check if reward was purchased.
      else if (reward.purchased) {
        setPurchasedRewards((prevState) => [...prevState, reward]);
      }
      // Reward still open.
      else {
        setOpenRewards((prevState) => [...prevState, reward]);
      }
      return true;
    });
  };

  /*****************/
  /***** UTILS *****/
  /*****************/

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
    console.log("accountType changed");
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
                    account={account}
                    accountType={accountType}
                    logout={logout}
                    isDataLoading={isDataLoading}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
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
                  setErrorMessage={setErrorMessage}
                />
              </ProtectedPage>
            }
          />
          {/* Tasks */}
          <Route
            path="tasks"
            element={
              <Tasks
                tasksCounter={tasksCounter}
                openTasks={openTasks}
                completedTasks={completedTasks}
                approvedTasks={approvedTasks}
                expiredTasks={expiredTasks}
              />
            }
          />
          {/* Rewards */}
          <Route
            path="rewards"
            element={
              <Rewards
                rewardsCounter={rewardsCounter}
                openRewards={openRewards}
                purchasedRewards={purchasedRewards}
                redeemedRewards={redeemedRewards}
                approvedRewards={approvedRewards}
              />
            }
          />
          {/* Marketplace */}
          <Route
            path="marketplace"
            element={
              <ProtectedPage accountType={accountType}>
                <Marketplace
                  rewardsCounter={openRewards.length}
                  openRewards={openRewards}
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
