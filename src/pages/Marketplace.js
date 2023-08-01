// Components
import PageHeader from "../components/PageHeader";

function Marketplace({ rewardsCounter, openRewards }) {
  // Return Marketplace component.
  return (
    <>
      {/* Page header */}
      <PageHeader title="Marketplace" />
      {/* Page content */}
      <div className="flex w-full flex-col gap-4">
        <p className="w-full break-words">{rewardsCounter}</p>
        <p className="w-full break-words">{openRewards.toString()}</p>
      </div>
    </>
  );
}

export default Marketplace;
