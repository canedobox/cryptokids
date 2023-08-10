import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
// Components
import Button from "../components/Button";
import HeroImage from "../assets/hero-image.webp";
// Modals
import Stats from "./modals/Stats";
// Contract files
import contractAddress from "../contracts/CryptoKids-address.json";
import contractAbi from "../contracts/CryptoKids-abi.json";

/**
 * Homepage.
 * @param {function} connectionHandler - Function to handle connection.
 * @param {function} setErrorMessage - Function to set error message.
 * @param {object} utils - Utility functions object.
 */
function Home({ connectionHandler, setErrorMessage, utils }) {
  /***** STATES *****/
  // State for stats.
  const [stats, setStats] = useState({
    accountsCounter: {
      parentsRegistered: 0,
      parentsDeleted: 0,
      childrenAdded: 0,
      childrenRemoved: 0
    },
    tasksCounter: {
      added: 0,
      deleted: 0,
      completed: 0,
      approved: 0,
      tokensEarned: 0
    },
    rewardsCounter: {
      added: 0,
      deleted: 0,
      purchased: 0,
      redeemed: 0,
      approved: 0,
      tokensSpent: 0
    }
  });
  // State variables to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);

  /***** METHODS *****/
  /**
   * Get dapp statistics from the smart contract.
   * NOTE: This method is called before the user connects to the dapp,
   *       for that reason the provider is used to get the contract
   *       instead of the signer.
   */
  const getStats = async () => {
    // Check if MetaMask is installed.
    if (window.ethereum && window.ethereum.isMetaMask) {
      // Get provider.
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Get network.
      const network = await provider.getNetwork();
      // Check if the network is supported.
      if (!contractAddress[network.chainId]) {
        setErrorMessage(
          "Network not supported, connect to Sepolia test network instead."
        );
        return;
      }

      // Get contract.
      const contract_ = new ethers.Contract(
        contractAddress[network.chainId].address,
        contractAbi,
        provider // Use provider to get contract as the user has not connected yet.
      );

      // Get accounts counter.
      const accountsCounter = await contract_
        .accountsCounter()
        .catch((error) => {
          setErrorMessage(error);
        });

      // Get tasks counter.
      const tasksCounter = await contract_.tasksCounter().catch((error) => {
        setErrorMessage(error);
      });

      // Get rewards counter.
      const rewardsCounter = await contract_.rewardsCounter().catch((error) => {
        setErrorMessage(error);
      });

      // Set stats.
      setStats({ accountsCounter, tasksCounter, rewardsCounter });
    }
    // If MetaMask is not installed.
    else {
      setErrorMessage("Please, install MetaMask.");
    }
  };

  /***** REACT HOOKS *****/
  useEffect(() => {
    // Get stats only once.
    if (!stats) {
      getStats();
    }
  }, []);

  // Return Home component.
  return (
    <>
      {/* Stats modal */}
      {stats && (
        <Stats
          stats={stats}
          isModalOpened={isModalOpened}
          setIsModalOpened={setIsModalOpened}
          utils={utils}
        />
      )}

      {/* Main content */}
      <div className="flex h-screen w-full flex-col items-center justify-start">
        {/* Hero section */}
        <div
          className={twMerge(
            "flex w-full flex-col items-center justify-center bg-primary-700 pt-16 text-white"
          )}
        >
          {/* Hero container */}
          <div
            className={twMerge(
              "flex w-full max-w-7xl flex-col items-center justify-center",
              "md:flex-row md:justify-start",
              "gap-4 overflow-hidden px-4 pb-4 pt-12",
              "xs:pt-16 md:gap-8 md:px-8 md:pt-8 xl:overflow-visible"
            )}
          >
            {/* Hero text */}
            <div
              className={twMerge(
                "flex w-full max-w-md flex-col items-center justify-center gap-4 text-center",
                "md:items-start md:text-left"
              )}
            >
              {/* Title */}
              <h1 className="font-poppins text-4xl font-bold uppercase xs:text-5xl md:text-6xl">
                Welcome to CryptoKids!
              </h1>
              {/* Description */}
              <p className=" text-lg text-primary-200">
                Join us in an exciting journey to introduce children to the
                world of blockchain technology and its real-world applications.
              </p>
              {/* CTA button */}
              <Button onClick={connectionHandler} variant="outlineWhite">
                Get Started
              </Button>
            </div>

            {/* Hero image */}
            <div className="flex w-full items-center justify-start sm:justify-center">
              <img
                src={HeroImage}
                alt="CryptoKids Dapp on small and large screens"
                className={twMerge(
                  "h-auto min-h-[346px] w-fit min-w-[theme(maxWidth.xl)] max-w-xl",
                  "sm:min-h-[404px] md:min-h-[460px]",
                  "sm:min-w-[theme(maxWidth.2xl)] sm:max-w-2xl md:min-w-[theme(maxWidth.3xl)] md:max-w-3xl"
                )}
              />
            </div>
          </div>

          {/* Stats section */}
          {stats && (
            <div className="flex w-full flex-col items-center justify-center">
              {/* Section Container */}
              <div
                className={twMerge(
                  "flex w-full max-w-7xl flex-col items-center justify-center",
                  "gap-4 px-4 pb-8"
                )}
              >
                {/* Stats */}
                <div
                  className={twMerge(
                    "flex w-full flex-row flex-wrap items-start justify-center gap-4",
                    "text-center"
                  )}
                >
                  {/* Parents registered */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {stats.accountsCounter.parentsRegistered.toString()}
                    </h1>
                    <p className="text-primary-200">Parents registered</p>
                  </div>
                  {/* Children added */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {stats.accountsCounter.childrenAdded.toString()}
                    </h1>
                    <p className="text-primary-200">Children added</p>
                  </div>
                  {/* Tasks created */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {stats.tasksCounter.added.toString()}
                    </h1>
                    <p className="text-primary-200">Tasks created</p>
                  </div>
                  {/* Tasks completed */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {stats.tasksCounter.completed.toString()}
                    </h1>
                    <p className="text-primary-200">Tasks completed</p>
                  </div>
                  {/* Tokens earned */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {utils.addTokenSymbol(stats.tasksCounter.tokensEarned)}
                    </h1>
                    <p className="text-primary-200">Tokens earned</p>
                  </div>
                  {/* Rewards created */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {stats.rewardsCounter.added.toString()}
                    </h1>
                    <p className="text-primary-200">Rewards created</p>
                  </div>
                  {/* Rewards purchased */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {stats.rewardsCounter.purchased.toString()}
                    </h1>
                    <p className="text-primary-200">Rewards purchased</p>
                  </div>
                  {/* Tokens spent */}
                  <div className="flex max-w-4xs flex-col gap-2 rounded-xl bg-primary-800 p-4">
                    <h1 className="font-poppins text-xl font-bold">
                      {utils.addTokenSymbol(stats.rewardsCounter.tokensSpent)}
                    </h1>
                    <p className="text-primary-200">Tokens spent</p>
                  </div>
                </div>

                {/* CTA */}
                <div
                  onClick={(event) => {
                    event.preventDefault();
                    utils.openModal(setIsModalOpened);
                  }}
                  className={twMerge(
                    "flex w-fit flex-row items-center break-words p-2",
                    "cursor-pointer border-b border-transparent font-semibold text-primary-200",
                    "hover:border-white hover:text-white active:text-white"
                  )}
                >
                  See all statistics
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Getting started section */}
        <div className="flex w-full flex-col items-center justify-center">
          {/* Section Container */}
          <div
            className={twMerge(
              "flex w-full max-w-6xl flex-col items-center justify-center",
              "gap-4 px-4 py-8"
            )}
          >
            {/* Title */}
            <h1 className="text-center font-poppins text-2xl font-bold text-primary-500 xs:text-3xl">
              Getting Started
            </h1>

            {/* Steps */}
            <div
              className={twMerge(
                "flex w-full flex-row flex-wrap items-start justify-center gap-4 py-4",
                "border-t border-gray-200 text-center"
              )}
            >
              {/* Step 1 */}
              <div className="flex max-w-3xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Step 1:
                </h1>
                <p className="text-gray-600">
                  Sign up as a parent using MetaMask.
                </p>
              </div>
              {/* Step 2 */}
              <div className="flex max-w-3xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Step 2:
                </h1>
                <p className="text-gray-600">
                  Add children to your family group.
                </p>
              </div>
              {/* Step 3 */}
              <div className="flex max-w-3xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Step 3:
                </h1>
                <p className="text-gray-600">
                  Assign tasks and rewards to your children.
                </p>
              </div>
              {/* Step 4 */}
              <div className="flex max-w-3xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Step 4:
                </h1>
                <p className="text-gray-600">
                  Children complete tasks and earn tokens.
                </p>
              </div>
              {/* Step 5 */}
              <div className="flex max-w-3xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Step 5:
                </h1>
                <p className="text-gray-600">
                  Children exchange tokens for rewards.
                </p>
              </div>
            </div>

            {/* CTA button */}
            <Button
              onClick={connectionHandler}
              variant="large"
              className={"w-full max-w-xs"}
            >
              Sign Up As A Parent
            </Button>
          </div>
        </div>

        {/* Benefits section */}
        <div className="flex w-full flex-col items-center justify-center">
          {/* Section Container */}
          <div
            className={twMerge(
              "flex w-full max-w-6xl flex-col items-center justify-center",
              "gap-4 px-4 py-8"
            )}
          >
            {/* Title */}
            <h1 className="text-center font-poppins text-2xl font-bold text-primary-500 xs:text-3xl">
              Benefits
            </h1>

            {/* Benefits */}
            <div
              className={twMerge(
                "flex w-full flex-row flex-wrap items-start justify-center gap-4 py-4",
                "border-t border-gray-200 text-center"
              )}
            >
              {/* Interactive Learning */}
              <div className="flex max-w-2xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Interactive Learning:
                </h1>
                <p className="text-gray-600">
                  Gamified tasks and challenges make learning about blockchain
                  technology fun and engaging.
                </p>
              </div>
              {/* Safe Environment */}
              <div className="flex max-w-2xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Safe Environment:
                </h1>
                <p className="text-gray-600">
                  Our platform runs on the Sepolia testnet, ensuring a risk-free
                  space for kids to make mistakes and learn.
                </p>
              </div>
              {/* Real-World Skills */}
              <div className="flex max-w-2xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Real-World Skills:
                </h1>
                <p className="text-gray-600">
                  Develop financial literacy, problem-solving skills, and
                  critical thinking through practical activities.
                </p>
              </div>
              {/* Empowerment */}
              <div className="flex max-w-2xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Empowerment:
                </h1>
                <p className="text-gray-600">
                  Equip your children with essential digital literacy skills to
                  navigate the crypto world confidently.
                </p>
              </div>
              {/* Parental Involvement */}
              <div className="flex max-w-2xs flex-col gap-2 rounded-xl bg-gray-200 p-4">
                <h1 className="font-poppins text-xl font-bold text-gray-800">
                  Parental Involvement:
                </h1>
                <p className="text-gray-600">
                  Collaborate with your children's learning journey by setting
                  up tasks and rewards based on their interests.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="flex w-full flex-col items-center justify-center">
          {/* Section Container */}
          <div
            className={twMerge(
              "flex w-full max-w-6xl flex-col items-center justify-center",
              "gap-4 px-4 py-8"
            )}
          >
            {/* Title */}
            <h1 className="text-center font-poppins text-2xl font-bold text-primary-500 xs:text-3xl">
              Frequently Asked Questions
            </h1>

            {/* Question: What is CryptoKids? */}
            <div
              className={twMerge(
                "flex w-full flex-col items-center justify-center gap-4 py-4",
                "border-t border-gray-200 text-center"
              )}
            >
              {/* Title */}
              <h1 className="font-poppins text-xl font-bold text-gray-800 xs:text-2xl">
                What is CryptoKids?
              </h1>
              {/* Description */}
              <div
                className={twMerge(
                  "flex flex-col gap-2 p-4 text-justify",
                  "rounded-xl border border-gray-200 bg-white text-gray-600 shadow-md"
                )}
              >
                <p>
                  CryptoKids is an innovative and interactive decentralised
                  application designed to provide a safe, fun, and exciting
                  platform where children can learn about blockchain technology
                  and its real-world applications.
                </p>
                <p>
                  By completing tasks and challenges assigned by a parent, such
                  as household chores and educational activities, children can
                  earn tokens (CK) that can be exchanged for rewards in a
                  virtual marketplace. This gamified experience encourages
                  children to actively participate, learn, and apply their
                  knowledge in a practical setting.
                </p>
              </div>
            </div>

            {/* Question: How does it work? */}
            <div
              className={twMerge(
                "flex w-full flex-col items-center justify-center gap-4 py-4",
                "border-t border-gray-200 text-center"
              )}
            >
              {/* Title */}
              <h1 className="font-poppins text-xl font-bold text-gray-800 xs:text-2xl">
                How does it work?
              </h1>
              {/* Description */}
              <div
                className={twMerge(
                  "flex flex-col gap-2 p-4 text-justify",
                  "rounded-xl border border-gray-200 bg-white text-gray-600 shadow-md"
                )}
              >
                <p>
                  <b>1)</b> Let's say, Alice, a parent, signs up for CryptoKids
                  Dapp and adds her child, Bob, to her family group.
                </p>
                <p>
                  <b>2)</b> Alice creates and assigns a task to Bob, in this
                  scenario a household chore, which is “Clean your bedroom”, the
                  task carries a reward of 10 tokens.
                </p>
                <p>
                  <b>3)</b> Bob completes the task within a given deadline and
                  marks it as completed on the application.
                </p>
                <p>
                  <b>4)</b> Alice reviews the task, finds it well done, and
                  approves its completion.
                </p>
                <p>
                  <b>5)</b> The smart contract then transfers 10 tokens to Bob's
                  wallet as a reward for completing the task.
                </p>
                <p>
                  <b>5)</b> With the earned tokens, Bob visits the marketplace
                  in the application and decides to purchase a “Fun Day out at
                  the Zoo” reward (which was created and assigned by Alice), he
                  exchanges 10 tokens for the rewards.
                </p>
                <p>
                  <b>6)</b> Bob redeems the reward and can now talk to Alice to
                  plan their fun day out.
                </p>
              </div>
            </div>

            {/* Question: Why is it needed? */}
            <div
              className={twMerge(
                "flex w-full flex-col items-center justify-center gap-4 py-4",
                "border-t border-gray-200 text-center"
              )}
            >
              {/* Title */}
              <h1 className="font-poppins text-xl font-bold text-gray-800 xs:text-2xl">
                Why is it needed?
              </h1>
              {/* Description */}
              <div
                className={twMerge(
                  "flex flex-col gap-2 p-4 text-justify",
                  "rounded-xl border border-gray-200 bg-white text-gray-600 shadow-md"
                )}
              >
                <p>
                  Blockchain technology is revolutionising various industries
                  and changing the way we transact, store, and secure digital
                  assets. It is very important to recognise that blockchain
                  technology is not limited to adults alone and that children
                  are an essential part of our digital future. Therefore,
                  blockchain education for children is crucial to ensuring that
                  the younger generation is ready for an imminent future as
                  blockchain technology continues to develop and becomes more
                  prevalent in our daily lives.
                </p>
                <p>
                  Although there are a few blockchain courses designed for
                  children available, there aren't any applications that allow
                  children to use what they've learned in a practical
                  environment while enabling them to experiment and make
                  mistakes without any real financial risks or concerns.
                </p>
                <p>
                  CryptoKids enables parents to introduce their children to
                  blockchain concepts at a young age, empowering children to
                  become active participants in the crypto world and providing
                  them with the knowledge and skills to navigate the digital
                  world confidently and make informed decisions about their
                  digital assets and transactions.
                </p>
              </div>
            </div>

            {/* Question: What are the benefits? */}
            <div
              className={twMerge(
                "flex w-full flex-col items-center justify-center gap-4 py-4",
                "border-t border-gray-200 text-center"
              )}
            >
              {/* Title */}
              <h1 className="font-poppins text-xl font-bold text-gray-800 xs:text-2xl">
                What are the benefits?
              </h1>
              {/* Description */}
              <div
                className={twMerge(
                  "flex flex-col gap-2 p-4 text-justify",
                  "rounded-xl border border-gray-200 bg-white text-gray-600 shadow-md"
                )}
              >
                <p>
                  <b>For parents:</b> CryptoKids provides parents with a safe
                  and controlled environment for their children to learn and
                  explore blockchain technology. Parents can actively
                  participate in their children's learning journey by assigning
                  tasks and rewards based on the children's interests, which
                  encourages them to actively participate and learn, while also
                  promoting collaborative learning and family engagement.
                </p>
                <p>
                  <b>For children:</b> In addition to teaching children about
                  blockchain technology, CryptoKids also focuses on its
                  real-world applications, such as decentralization, smart
                  contracts, digital ownership, cryptocurrencies, and digital
                  transactions. While also helping to promote financial
                  literacy, curiosity for learning, problem-solving skills, and
                  critical thinking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className={twMerge(
            "flex h-fit w-full flex-row items-center justify-center text-center",
            "bg-gray-300 py-3 text-sm text-gray-600"
          )}
        >
          Author:{" "}
          <Link
            to="https://github.com/canedobox"
            target="_blank"
            className="border-b border-transparent p-1 hover:border-gray-600"
          >
            @canedobox
          </Link>{" "}
          | GitHub:{" "}
          <Link
            to="https://github.com/canedobox/cryptokids-dapp"
            target="_blank"
            className="border-b border-transparent p-1 hover:border-gray-600"
          >
            @cryptokids-dapp
          </Link>
        </footer>
      </div>
    </>
  );
}

export default Home;
