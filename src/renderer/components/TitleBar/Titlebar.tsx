import React from 'react';
// Components
import ControlButtonsContainer from './ControlButtons/ControlButtonsContainer';
// CSS
import './TitleBar.css';

const TitleBar = ({ title }) => {
  return (
    <div className="title-bar ignore-print">
      <div className="title">{title}</div>
      <ControlButtonsContainer />
    </div>
  );
};

export default TitleBar;
