import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Header from "./components/Header";
import CONTRACT_ABI from "./abis/CryptoKidsPOC.json";
import ParentSignUp from "./components/ParentSignUp";

function App() {
  /***** VARIABLES *****/
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //Hardhat
  //const CONTRACT_ADDRESS = ""; //Sepolia

  /***** STATES *****/
  // Account
  const [account, setAccount] = useState(null);
  const [accountType, setAccountType] = useState("");
  // Contract
  const [contract, setContract] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  // Utils
  const [isLoading, setIsLoading] = useState(null);
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
  /***** METAMASK CONNECTION *****/
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
          // Reset some values.
          setAccountType("");
          setErrorMessage(null);
          // Initialize the page.
          pageInit();
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

  /**
   * Set up an event listener for when the account changes on MetaMask.
   */
  window.ethereum.on("accountsChanged", async () => {
    connectionHandler();
  });

  /*************************/
  /***** CONTRACT DATA *****/
  /*************************/

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
    // Get contract.
    let tempContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
    setContract(tempContract);

    // Get token symbol.
    let tempTokenSymbol = await tempContract.symbol().catch((error) => {
      setErrorMessage(error.message);
    });
    setTokenSymbol(tempTokenSymbol);

    // Get account type.
    let tempAccountType = await tempContract.getAccountType().catch((error) => {
      setErrorMessage(error.message);
    });
    setAccountType(tempAccountType ? tempAccountType : "Not registered");

    // Stop loading.
    setIsLoading(false);
  };

  /**
   * Fetch data from the contract based on the user's account type:
   * parent or child.
   */
  const getData = async () => {
    // Start loading.
    setIsLoading(true);
    // Reset values.
    resetData();
    setErrorMessage(null);

    // Check if user is a parent.
    if (contract && accountType === "Parent") {
      // Get user's family group.
      let tempFamilyGroup = await contract.getFamilyGroup().catch((error) => {
        setErrorMessage(error.message);
      });
      setFamilyGroup(tempFamilyGroup);
      // Get user's family group tasks.
      let tempTasks = await contract.getFamilyGroupTasks().catch((error) => {
        setErrorMessage(error.message);
      });
      organizeTasks(tempTasks);
      // Get user's family group rewards.
      let tempRewards = await contract
        .getFamilyGroupRewards()
        .catch((error) => {
          setErrorMessage(error.message);
        });
      organizeRewards(tempRewards);
    }
    // Check if user is a child.
    else if (contract && accountType === "Child") {
      // Get user's tasks.
      let tempTasks = await contract.getTasks(account).catch((error) => {
        setErrorMessage(error.message);
      });
      organizeTasks(tempTasks);
      // Get user's rewards.
      let tempRewards = await contract.getRewards(account).catch((error) => {
        setErrorMessage(error.message);
      });
      organizeRewards(tempRewards);
    }

    // Stop loading
    setIsLoading(false);
  };

  /**
   * Organize tasks into different categories based on their status:
   * approved, completed, expired, or open.
   * @param tasks_ - An array of tasks.
   */
  const organizeTasks = (tasks_) => {
    // Set tasks counter.
    setTasksCounter(tasks_.length);
    // Loop through tasks.
    tasks_.map((task) => {
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
   * @param rewards_ - An array of rewards.
   */
  const organizeRewards = (rewards_) => {
    // Set rewards counter.
    setRewardsCounter(rewards_.length);
    // Loop through rewards.
    rewards_.map((reward) => {
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

  /**
   * Reset all data related to family groups, tasks, and rewards.
   */
  const resetData = () => {
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
   * Listen for changes to `account`.
   */
  useEffect(() => {
    pageInit();
  }, [account]);

  /**
   * Listen for changes to `accountType`.
   */
  useEffect(() => {
    getData();
  }, [accountType]);

  return (
    <div className="font-montserrat text-slate-800">
      <Header
        account={account}
        accountType={accountType}
        connectionHandler={connectionHandler}
      />

      <main className="flex min-h-screen flex-col items-center justify-start pt-16">
        <div className="w-full max-w-4xl p-4">
          <div>
            {errorMessage && (
              <div className="text-red-700 p-4 break-words">{errorMessage}</div>
            )}
            {isLoading && (
              <div className="font-bold text-center">Loading...</div>
            )}
            {!isLoading && accountType === "Not registered" && (
              <ParentSignUp
                contract={contract}
                setErrorMessage={setErrorMessage}
              />
            )}
            {!isLoading && accountType && (
              <div className="flex flex-col gap-4 break-words">
                <span>Token symbol: {tokenSymbol}</span>
                <span>Account connected: {account}</span>
                <span>Account type: {accountType}</span>
                <span>Family group: {familyGroup.toString()}</span>
                <span>Tasks counter: {tasksCounter}</span>
                <span>Open tasks: {openTasks.toString()}</span>
                <span>Rewards counter:{rewardsCounter}</span>
                <span>Open rewards: {openRewards.toString()}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
