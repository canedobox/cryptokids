import { useState } from "react";
import { twMerge } from "tailwind-merge";
// Components
import ChildCard from "../components/ChildCard";
import PageHeader from "../components/PageHeader";
// Pages
import Loading from "./Loading";
// Modals
import AddChild from "./modals/AddChild";
import RemoveChild from "./modals/RemoveChild";

function FamilyGroup({
  contract,
  tokenSymbol,
  familyGroup,
  isDataLoading,
  setErrorMessage,
  utils
}) {
  /***** STATES *****/
  // State variables to control modal.
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isModalOpened2, setIsModalOpened2] = useState(false);
  // Selected child.
  const [selectedChild, setSelectedChild] = useState(null);

  /***** METHODS *****/
  /**
   * Select a child.
   * @param child - Child to be selected.
   */
  const selectChild = (child) => {
    setSelectedChild(child);
    utils.openModal(setIsModalOpened2);
  };

  // Return FamilyGroup component.
  return (
    <>
      {/* Add child modal */}
      <AddChild
        contract={contract}
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
        setErrorMessage={setErrorMessage}
        utils={utils}
      />
      {/* Remove child modal */}
      <RemoveChild
        contract={contract}
        child={selectedChild}
        isModalOpened={isModalOpened2}
        setIsModalOpened={setIsModalOpened2}
        setErrorMessage={setErrorMessage}
        utils={utils}
      />
      {/* Page header */}
      <PageHeader
        title="Family Group"
        cta={{
          label: "Add Child",
          onClick: () => {
            utils.openModal(setIsModalOpened);
          }
        }}
      />
      {/* Page content */}
      {/* If data is finished loading, render family group. */}
      {isDataLoading ? (
        <Loading />
      ) : (
        <div
          className={twMerge(
            "box-border flex w-full flex-wrap justify-center gap-4 p-4 md:justify-start",
            familyGroup && familyGroup.length > 1 && "md:justify-center"
          )}
        >
          {familyGroup && familyGroup.length === 0 ? (
            <div>No children in your family group.</div>
          ) : (
            // Loop through family group and render child cards.
            familyGroup.map((child, index) => (
              <ChildCard
                key={index}
                contract={contract}
                tokenSymbol={tokenSymbol}
                child={child}
                selectChild={selectChild}
                setErrorMessage={setErrorMessage}
                utils={utils}
                className={twMerge(
                  familyGroup && familyGroup.length > 1 && "md:max-w-full"
                )}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}

export default FamilyGroup;
