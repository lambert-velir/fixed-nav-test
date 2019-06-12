import React, { useContext } from "react";
import { node, string } from "prop-types";
import Modal from "./Modal.jsx";
import { AppContext } from "./AppContainer.jsx";
import classNames from "classnames";
import * as R from "ramda";

export const propTypes = {
  children: node,
  hash: string.isRequired
};

const StoryModal = props => {
  const { children, hash } = props;

  const {
    state: { activeModal, modalIds },
    actions: { closeModal, setActiveModal }
  } = useContext(AppContext);

  const onCloseClick = e => {
    e.preventDefault();
    closeModal();
  };

  const onNextClick = e => {
    e.preventDefault();
    const index = modalIds.indexOf(hash);
    setActiveModal(modalIds[index + 1]);
  };

  const onPrevClick = e => {
    e.preventDefault();
    const index = modalIds.indexOf(hash);
    setActiveModal(modalIds[index - 1]);
  };

  return (
    <Modal
      onClose={closeModal}
      isOpen={activeModal === hash}
      data-hash-modal={hash} // data-story-modal is a hook for useModal
    >
      <div className="story-modal">
        <div className="story-modal__content">{children}</div>
        <div className="story-modal__controls">
          <button className="story-modal__close" onClick={onCloseClick}>
            <span className="story-modal__icon" />
            close
          </button>
          <button
            className={classNames("story-modal__icon", {})}
            onClick={onNextClick}
          >
            RIGHT
          </button>
          <button
            className={classNames("story-modal__icon", {})}
            onClick={onPrevClick}
          >
            LEFT
          </button>
        </div>
      </div>
    </Modal>
  );
};

StoryModal.propTypes = propTypes;
export default StoryModal;
