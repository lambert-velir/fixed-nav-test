import React, { useEffect, useRef } from "react";
import { bool, func, oneOfType, string, node } from "prop-types";
import classNames from "classnames";

// https://hackernoon.com/its-a-focus-trap-699a04d66fb5
import FocusLock from "react-focus-lock";

const propTypes = {
  title: node,
  isOpen: bool.isRequired,
  onClose: func.isRequired,
  className: string,
  children: oneOfType([node, func])
};

const Modal = props => {
  const { isOpen, onClose, title, children, className, ...rest } = props;

  const overflowRef = useRef();

  // keep around the children so when we close, we can fade out with the content
  const childrenCache = useRef();

  // if children is a funciton, render it with some state
  const content =
    typeof children === "function" ? children({ isOpen, title }) : children;

  if (content) {
    childrenCache.current = content;
  }

  // listen for esc if the modal is open
  useEffect(
    () => {
      const keydownHandler = e => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      if (isOpen) {
        // always open with the modal scrolled to the top
        if (overflowRef.current) {
          overflowRef.current.scrollTo(0, 0);
        }

        window.addEventListener("keydown", keydownHandler);
        return () => window.removeEventListener("keydown", keydownHandler);
      }
      else {
        window.removeEventListener("keydown", keydownHandler);
      }
    },
    [isOpen, onClose]
  );

  useEffect(
    () => {
      document.querySelector("body").classList.toggle("modal-open", isOpen);
    },
    [isOpen]
  );

  const classes = classNames("modal", className, {
    "is-open": isOpen
  });

  return (
    <div className={classes} role="dialog" ref={overflowRef} {...rest}>
      <div className="modal__box-holder">
        <div className="modal__overlay" onClick={onClose} />
        <FocusLock
          disabled={!isOpen}
          returnFocus={true}
          className="modal__box"
          role="dialog"
        >
          <div className="modal__title">
            {title}
            <button
              type="button"
              className="modal__close"
              onClick={onClose}
              aria-label="close"
            >
              <svg
                width="24"
                height="24"
                className="octicon octicon-x"
                viewBox="0 0 12 16"
                aria-hidden="true"
              >
                <path d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z" />
              </svg>
            </button>
          </div>
          <div className="modal__content">{childrenCache.current}</div>
        </FocusLock>
      </div>
    </div>
  );
};

Modal.propTypes = propTypes;
export default Modal;
