import React from 'react';
// Components
import { Close, Maximize, Dash } from './ControlButtons';

const { minimize, maximizeToggle, close } = window.electron;

const ControlButtonsContainer = () => {
  return (
    <div className="control-buttons">
      <Dash onClick={minimize} className="control-buttons-icon" />
      <Maximize onClick={maximizeToggle} className="control-buttons-icon" />
      <Close onClick={close} className="control-buttons-icon close" />
    </div>
  );
};

export default ControlButtonsContainer;
