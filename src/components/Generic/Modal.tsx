interface ModalContainerProps {
  identifier: string;
  children?: React.ReactNode | undefined;
  extraClass?: string;
  dialogClass?: string;
  refModal?: React.RefObject<HTMLDivElement>;
}

const ModalContainer = ({
  children,
  identifier,
  extraClass = "",
  dialogClass = "",
  refModal,
}: ModalContainerProps) => {
  return (
    <div
      className={"modal fade ".concat(extraClass)}
      id={identifier}
      tabIndex={-1}
      aria-labelledby={`${identifier}Label`}
      aria-hidden="true"
      dir="ltr"
      ref={refModal}
    >
      <div
        className={"modal-dialog modal-dialog-centered ".concat(dialogClass)}
      >
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

interface ModalHeaderProps {
  identifier: string;
  title: string;
}

const ModalHeader = ({ identifier, title }: ModalHeaderProps) => {
  return (
    <div className="modal-header">
      <h1 className="modal-title fs-5" id={`${identifier}Label`}>
        {title}
      </h1>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></button>
    </div>
  );
};

interface ModalBodyProps {
  children?: React.ReactNode | undefined;
}

const ModalBody = ({ children }: ModalBodyProps) => {
  return <div className="modal-body">{children}</div>;
};

interface ModalFooterProps {
  children?: React.ReactNode | undefined;
}
const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className="modal-footer justify-content-center">{children}</div>;
};

export { ModalContainer, ModalHeader, ModalBody, ModalFooter };
