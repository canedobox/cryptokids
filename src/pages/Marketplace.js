function Marketplace({ rewardsCounter, openRewards }) {
  // Return Marketplace component.
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold">Marketplace</h1>
      <p className="w-full break-words">{rewardsCounter}</p>
      <p className="w-full break-words">{openRewards.toString()}</p>
    </div>
  );
}

export default Marketplace;
