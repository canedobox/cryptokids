// Components
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
// Pages
import AddChild from "./forms/AddChild";

function FamilyGroup({
  contract,
  familyGroup,
  setErrorMessage,
  isModalOpened,
  setIsModalOpened,
  openModal
}) {
  // Return FamilyGroup component.
  return (
    <>
      {/* Modal */}
      <Modal
        title="Add Child"
        isModalOpened={isModalOpened}
        setIsModalOpened={setIsModalOpened}
      >
        <AddChild contract={contract} setErrorMessage={setErrorMessage} />
      </Modal>
      {/* Page header */}
      <PageHeader
        title="Family Group"
        cta={{ label: "Add Child", onClick: openModal }}
      />
      {/* Page content */}
      <div className="flex w-full flex-col gap-4">
        <p className="w-full break-words">{familyGroup.toString()}</p>
      </div>
    </>
  );
}

export default FamilyGroup;
