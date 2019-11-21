import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ content = '' }) => (
  <div className="Footer u-paddingLeftSm u-paddingTopLg">{content}</div>
);

Footer.propTypes = {
  content: PropTypes.string.isRequired
};

export default Footer;
