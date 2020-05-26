import React from 'react';

const Alert = ({ alert, closeAlert }) => {
  return (
    alert !== null && (
      <div
        className={`alert alert-${alert.type}`}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <i className="fas fa-info-circle"> {alert.msg} </i>
        <button onClick={closeAlert} style={{ border: 'none' }}>
          <i className="fas fa-window-close fa-lg"></i>
        </button>
      </div>
    )
  );
};

export default Alert;
