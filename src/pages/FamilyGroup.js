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
  // Selected child.
  const [selectedChild, setSelectedChild] = useState(null);
  // State variables to control modal.
  const [isAddChildModalOpened, setIsAddChildModalOpened] = useState(false);
  const [isRemoveChildModalOpened, setIsRemoveChildModalOpened] =
    useState(false);
  // State variables to control loading indicator.
  const [isAddPending, setIsAddPending] = useState(false);
  const [isRemovePending, setIsRemovePending] = useState(false);

  /***** METHODS *****/
  /**
   * Select a child.
   * @param child - Child to be selected.
   */
  const selectChild = (child) => {
    // Set selected child.
    setSelectedChild(child);
    // Open modal.
    utils.openModal(setIsRemoveChildModalOpened);
  };

  /**
   * Deselect a child.
   */
  const deselectChild = (formRef = null) => {
    // Deselect child.
    setSelectedChild(null);
    // Close modal.
    if (formRef) {
      utils.closeModal(setIsAddChildModalOpened, formRef);
    } else {
      utils.closeModal(setIsRemoveChildModalOpened);
    }
  };

  /**
   * Add a child to the contract.
   * @param event - Event that triggered the function.
   * @param formRef - Form reference.
   */
  const addChild = (event, formRef) => {
    // Prevent default form submission.
    event.preventDefault();
    // Reset error message.
    setErrorMessage(null);
    // Start loading indicator.
    setIsAddPending(true);

    // Call the `addChild` function on the contract.
    contract
      .addChild(event.target.childAddress.value, event.target.childName.value)
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectChild(formRef);
          // Stop loading indicator.
          setIsAddPending(false);
        });
      })
      .catch((error) => {
        setErrorMessage(error);
        // Set error message.
        setErrorMessage(error);
        // Stop loading indicator.
        setIsAddPending(false);
      });
  };

  /**
   * Remove a child from the contract.
   * @param child - Child to be removed (child.childAddress).
   */
  const removeChild = (child) => {
    // Reset error message.
    setErrorMessage(null);
    // Start loading indicator.
    setIsRemovePending(true);

    // Call the `removeChild` function on the contract.
    contract
      .removeChild(child.childAddress)
      .then(async (receipt) => {
        // Wait for the transaction to be mined.
        receipt.wait().then(() => {
          utils.fetchData();
          deselectChild();
          // Stop loading indicator.
          setIsRemovePending(false);
        });
      })
      .catch((error) => {
        // Set error message.
        setErrorMessage(error);
        // Stop loading indicator.
        setIsRemovePending(false);
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
        isModalOpened={isAddChildModalOpened}
        setIsModalOpened={setIsAddChildModalOpened}
        isAddPending={isAddPending}
        utils={utils}
      />
      {/* Remove child modal */}
      <RemoveChild
        selectedChild={selectedChild}
        deselectChild={deselectChild}
        removeChild={removeChild}
        isModalOpened={isRemoveChildModalOpened}
        setIsModalOpened={setIsRemoveChildModalOpened}
        isRemovePending={isRemovePending}
        utils={utils}
      />
      {/* Page header */}
      <PageHeader
        title="Family Group"
        cta={{
          label: "Add Child",
          onClick: () => {
            utils.openModal(setIsAddChildModalOpened);
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
