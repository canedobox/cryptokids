const ParentSignUp = ({ contract, setErrorMessage }) => {
  /**
   * Register a parent in the contract.
   * @param event - Event that triggered the function.
   */
  const registerParent = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Register a parent in the contract.
    contract.registerParent(event.target.parentName.value).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-4 my-10">
      <h1 className="text-2xl font-bold">Sign up as a parent</h1>
      <form onSubmit={registerParent} className="flex flex-col gap-2 w-60">
        <input
          id="parentName"
          type="text"
          required
          placeholder="Enter your name *"
          className="border-2 rounded-lg border-slate-200 bg-slate-100 h-10 p-2"
        />
        <button
          type="submit"
          className="bg-slate-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-500"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default ParentSignUp;
