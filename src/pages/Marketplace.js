// Components
import PageHeader from "../components/PageHeader";
// Pages
import Loading from "./Loading";

function Marketplace({ rewardsCounter, openRewards, isDataLoading }) {
  // Return Marketplace component.
  return (
    <>
      {/* Page header */}
      <PageHeader title="Marketplace" />
      {/* Page content */}
      {/* If data is finished loading, render marketplace. */}
      {isDataLoading ? (
        <Loading />
      ) : (
        <div className="flex w-full flex-col gap-4">
          <p className="w-full break-words">{rewardsCounter}</p>
          <p className="w-full break-words">{openRewards.toString()}</p>
        </div>
      )}
    </>
  );
}

export default Marketplace;
