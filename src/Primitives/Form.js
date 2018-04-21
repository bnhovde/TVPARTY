import styled from 'styled-components';

const Form = styled.form`
  background-color: ${props => (props.transparent ? 'transparent' : '#dedede')};
  color: white;
  will-change: top;
  z-index: 5;
`;

export default Form;
