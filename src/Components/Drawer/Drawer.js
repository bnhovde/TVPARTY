/**
*
* Drawer
*
*
*/
import React from 'react';
import styled from 'styled-components';
import variables from './../../constants/variables';

const { colors } = variables;

const DrawerWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.secondaryDark};
  color: white;
  z-index: 10;
  overflow-y: scroll; /* has to be scroll, not auto */
  -webkit-overflow-scrolling: touch;
  height: 100%;
  transform: translateY(${props => (props.visible ? '0%' : '100%')});
  transition: transform 0.2s ease;
`;

function Drawer(props) {
  const { children, visible } = props;

  return <DrawerWrapper visible={props.visible}>{children}</DrawerWrapper>;
}

export default Drawer;
