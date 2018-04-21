import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Alcometer.css';

const Alcometer = ({percentage}) => {
    return (
        <div className="Alcometer">
          <div style={{minWidth: percentage + "%"}} className="meter"/>
          <img src={`${process.env.PUBLIC_URL}/assets/karambaKaracho/alkohol2.png`}/>
        </div>
    );
};

Alcometer.propTypes = {
  percentage: PropTypes.number,
};

Alcometer.defaultProps = {
  percentage: 0,
};

export default Alcometer;
