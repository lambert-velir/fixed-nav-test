import React, { useState } from "react";
import { node } from "prop-types";

export const AppContext = React.createContext();

const propTypes = {
  children: node
};

const AppContainer = props => {
  const [activeModal, setActiveModal] = useState();

  const context = {
    state: {
      activeModal
    },
    actions: {
      setActiveModal,
      closeModal: setActiveModal
    }
  };

  return (
    <AppContext.Provider value={context}>
      <div>{props.children}</div>
    </AppContext.Provider>
  );
};

AppContainer.propTypes = propTypes;
export default AppContainer;
