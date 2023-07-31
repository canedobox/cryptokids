function Rewards({
  rewardsCounter,
  openRewards,
  purchasedRewards,
  redeemedRewards,
  approvedRewards
}) {
  // Return Rewards component.
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-3xl font-bold">Rewards</h1>
      <p className="w-full break-words">{rewardsCounter}</p>
      <p className="w-full break-words">{openRewards.toString()}</p>
      <p className="w-full break-words">{purchasedRewards.toString()}</p>
      <p className="w-full break-words">{redeemedRewards.toString()}</p>
      <p className="w-full break-words">{approvedRewards.toString()}</p>
    </div>
  );
}

export default Rewards;
