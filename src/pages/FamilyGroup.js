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
    // Set selected child.
    setSelectedChild(child);
    // Open modal.
    utils.openModal(setIsModalOpened2);
  };

  /**
   * Deselect a child.
   */
  const deselectChild = (formRef = null) => {
    // Deselect child.
    setSelectedChild(null);
    // Close modal.
    if (formRef) {
      utils.closeModal(setIsModalOpened);
    } else {
      utils.closeModal(setIsModalOpened2);
    }
    // Check if form exists.
    if (formRef) {
      // Reset form.
      formRef.current.reset();
    }
  };

  /**
   * Add a child to the contract.
   * @param event - Event that triggered the function.
   */
  const addChild = (event) => {
    event.preventDefault();
    setErrorMessage(null);

    // Call the `addChild` function on the contract.
    contract
      .addChild(event.target.childAddress.value, event.target.childName.value)
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  /**
   * Remove a child from the contract.
   * @param child - Child to be removed (child.childAddress).
   */
  const removeChild = (child) => {
    setErrorMessage(null);

    // Call the `removeChild` function on the contract.
    contract.removeChild(child.childAddress).catch((error) => {
      setErrorMessage(error);
    });
  };

  // Return FamilyGroup component.
  return (
    <>
      {/* Add child modal */}
      <AddChild
        selectedChild={selectedChild}
        deselectChild={deselectChild}
        addChild={addChild}
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
        utils={utils}
      />
      {/* Remove child modal */}
      <RemoveChild
        selectedChild={selectedChild}
        deselectChild={deselectChild}
        removeChild={removeChild}
        isModalOpened={isModalOpened2}
        setIsModalOpened={setIsModalOpened2}
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
            "box-border flex h-full w-full flex-wrap justify-center gap-4 p-4 md:justify-start",
            familyGroup && familyGroup.length > 1 && "md:justify-center"
          )}
        >
          {familyGroup && familyGroup.length === 0 ? (
            <div className="flex flex-1 items-center justify-center py-4">
              No children in your family group.
            </div>
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
