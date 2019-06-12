import React, { useContext } from "react";
import { node, string } from "prop-types";
import StoryModal from "./StoryModal.jsx";
import { AppContext } from "./AppContainer.jsx";
import cx from "classnames";

const propTypes = {
  modalHash: string.isRequired,
  children: node.isRequired,
  buttonContent: node,
  buttonClassName: string
};

const defaultProps = {
  buttonContent: <React.Fragment>More</React.Fragment>
};

const StoryModalButton = props => {
  const { children, buttonClassName, buttonContent, modalHash } = props;

  const {
    actions: { setActiveModal }
  } = useContext(AppContext);

  const handleClick = e => {
    e.preventDefault();
    setActiveModal(modalHash);
  };

  return (
    <React.Fragment>
      <a
        href="#"
        className={cx("am-btn animate--right", buttonClassName)}
        onClick={handleClick}
      >
        {buttonContent}
      </a>

      <StoryModal hash={modalHash}>{children}</StoryModal>
    </React.Fragment>
  );
};

StoryModalButton.propTypes = propTypes;
StoryModalButton.defaultProps = defaultProps;
export default StoryModalButton;
