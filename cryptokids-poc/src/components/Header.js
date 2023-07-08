const Header = ({ account, accountType, connectionHandler }) => {
  return (
    <header className="bg-slate-300 flex flex-row justify-center fixed top-0 right-0 left-0">
      <div className="flex flex-row justify-between items-center h-16 gap-4 px-4 w-full max-w-4xl">
        <div className="text-slate-900 flex flex-row items-center h-6">
          <span className="text-lg font-bold">CRYPTO</span>
          <span className="text-lg font-black">KIDS</span>
        </div>
        <div>
          {account ? (
            <button
              type="button"
              className="bg-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg"
              onClick={connectionHandler}
            >
              {(accountType && accountType + ": ") +
                account.slice(0, 4) +
                "..." +
                account.slice(38, 42)}
            </button>
          ) : (
            <button
              type="button"
              className="bg-slate-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-500"
              onClick={connectionHandler}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
