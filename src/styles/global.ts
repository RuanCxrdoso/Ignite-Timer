import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
 * {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
 }

 :focus {
  outline: 0;
  box-shadow: 0 0 0 2px ${(props) => props.theme['gray-500']};
 }

 body {
  background-color: ${(props) => props.theme['gray-900']};
  color: ${(props) => props.theme.white};
 }

 body, input, textarea, button {
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  size: 1rem;
 }
`