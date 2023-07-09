import { useEffect, useState } from "react";
import { ethers } from "ethers";
// Components
import Header from "./components/Header";
import ParentSignUp from "./pages/ParentSignUp";
// Pages
import Parent from "./pages/Parent";
import Child from "./pages/Child";
// Config
import networkConfig from "./networkConfig.json";
import contractAbi from "./abis/CryptoKidsPOC.json";

function App() {
  /***** STATES *****/
  // Account
  const [account, setAccount] = useState(null);
  const [accountType, setAccountType] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  // Contract
  const [contract, setContract] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(null);
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

  // Check if MetaMask is installed.
  if (window.ethereum && window.ethereum.isMetaMask) {
    //Set up an event listener for when the account changes on MetaMask.
    window.ethereum.on("accountsChanged", async () => {
      connectionHandler();
    });
  }

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

    // Get network.
    let network = await provider.getNetwork();
    // Check if the network is supported.
    if (!networkConfig[network.chainId]) {
      setErrorMessage(
        "Network not supported, connect to Sepolia test network instead."
      );
      // Stop loading.
      setIsLoading(false);
      return;
    }

    // Get contract.
    let tempContract = new ethers.Contract(
      networkConfig[network.chainId].address,
      contractAbi,
      signer
    );
    setContract(tempContract);

    // Get token symbol.
    let tempTokenSymbol = await tempContract.symbol().catch((error) => {
      setErrorMessage(error.message);
    });
    //setTokenSymbol(tempTokenSymbol); // "CKPOC" is too long.
    setTokenSymbol("CK"); // Use "CK" instead of "CKPOC".

    // Get token decimals.
    let tempTokenDecimals = await tempContract.decimals().catch((error) => {
      setErrorMessage(error.message);
    });
    setTokenDecimals(tempTokenDecimals);

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
    if (contract && account && accountType === "Parent") {
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
    else if (contract && account && accountType === "Child") {
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
      // Get user's accountBalance.
      let tempAccountBalance = await contract
        .balanceOf(account)
        .catch((error) => {
          setErrorMessage(error.message);
        });
      setAccountBalance(etherToNumber(tempAccountBalance));
    }

    // Stop loading
    setIsLoading(false);
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

  /**
   * Reset all data related to family groups, tasks, and rewards.
   */
  const resetData = () => {
    // Account
    setAccountBalance("");
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
    // Check if MetaMask is installed.
    if (window.ethereum && window.ethereum.isMetaMask) {
      pageInit();
    }
  }, [account]);

  /**
   * Listen for changes to `accountType` and `accountBalance`.
   */
  useEffect(() => {
    getData();
  }, [accountType]);

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

  return (
    <div className="font-montserrat text-slate-800">
      {/* Page header */}
      <Header
        account={account}
        accountType={accountType}
        connectionHandler={connectionHandler}
      />

      {/* Page content */}
      <main className="flex min-h-screen flex-col items-center justify-start pt-16">
        <div className="w-full max-w-4xl p-4">
          <div>
            {/* Display error message */}
            {errorMessage && (
              <div className="text-red-700 p-4 break-words">{errorMessage}</div>
            )}
            {/* Display welcome message */}
            {!isLoading && !account && (
              <div className="flex flex-col my-20 gap-2 items-center justify-center">
                <h1 className="text-2xl font-bold text-center max-w-md">
                  Welcome to CryptoKids!
                </h1>
                <p className="text-justify max-w-md">Proof of Concept Dapp</p>
              </div>
            )}
            {/* Display loading message */}
            {isLoading && (
              <div className="text-lg font-bold text-center my-20">
                Loading...
              </div>
            )}
            {/* If not loading, and user is not registered */}
            {!isLoading && account && accountType === "Not registered" && (
              <ParentSignUp
                contract={contract}
                setErrorMessage={setErrorMessage}
              />
            )}
            {/* If not loading, and user is a parent */}
            {!isLoading && account && accountType === "Parent" && (
              <Parent
                contract={contract}
                tokenSymbol={tokenSymbol}
                setErrorMessage={setErrorMessage}
                utils={{ numberToEther, etherToNumber }}
                familyGroup={familyGroup}
                tasksCounter={tasksCounter}
                openTasks={openTasks}
                completedTasks={completedTasks}
                approvedTasks={approvedTasks}
                expiredTasks={expiredTasks}
                rewardsCounter={rewardsCounter}
                openRewards={openRewards}
                purchasedRewards={purchasedRewards}
                redeemedRewards={redeemedRewards}
                approvedRewards={approvedRewards}
              />
            )}
            {/* If not loading, and user is a child */}
            {!isLoading && account && accountType === "Child" && (
              <Child
                contract={contract}
                tokenSymbol={tokenSymbol}
                accountBalance={accountBalance}
                setErrorMessage={setErrorMessage}
                utils={{ numberToEther, etherToNumber }}
                tasksCounter={tasksCounter}
                openTasks={openTasks}
                completedTasks={completedTasks}
                approvedTasks={approvedTasks}
                expiredTasks={expiredTasks}
                rewardsCounter={rewardsCounter}
                openRewards={openRewards}
                purchasedRewards={purchasedRewards}
                redeemedRewards={redeemedRewards}
                approvedRewards={approvedRewards}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
