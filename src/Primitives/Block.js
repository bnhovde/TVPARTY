import styled, { css } from 'styled-components';
import variables from './../constants/variables';

/**
*
* Block
*
* Adds global spacing to contents, use this everywhere you need margin or
* padding instead of adding padding to elements (where you can)
*
* Usage: <Block top={1} bottom={1}>...</Block>
*
*/

const { gutter } = variables;

const Block = styled.div`
  ${props =>
    props.top &&
    css`
      padding-top: ${props.top * gutter.vertical}vh;
    `};
  ${props =>
    props.bottom &&
    css`
      padding-bottom: ${props.bottom * gutter.vertical}vh;
    `};
  ${props =>
    props.left &&
    css`
      padding-left: ${props.left * gutter.horizontal}vw;
    `};
  ${props =>
    props.right &&
    css`
      padding-right: ${props.right * gutter.horizontal}vw;
    `};
  ${props =>
    props.align &&
    css`
      text-align: ${props.align};
    `};
`;

export default Block;
