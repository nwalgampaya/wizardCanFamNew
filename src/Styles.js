import styled, { css } from 'styled-components'
import headervector from '../src/img/headervector.png' ;

const btn = (light, dark) => css`



  white-space: nowrap;
  display: inline-block;
  border-radius: 5px;
  padding: 5px 15px;
  font-size: 16px;
  color: white;
  &:visited {
    color: white;
  }
   background-image:  ssbackGroundStyle
  border: 1px solid ${dark};
  &:hover {
    background-image: linear-gradient(${light}, ${dark});
    &[disabled] {
      background-image: linear-gradient(${light}, ${dark});
    }
  }
  &:visited {
    color: black;
  }
  &[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

var backGroundStyle = {
  width: "100%",
  height: "400px",
  backgroundImage: "url(" + { headervector } + ")"
}
const btnDefault = css`
  ${btn('#ffffff', '#d5d5d5')} color: #555;
`
;


const btnPrimary = btn('#4f93ce', '#285f8f')
const btnDanger = btn('#e27c79', '#c9302c');

export default styled.div`
  font-family: sans-serif;

//   h1 {
//     text-align: center;
//     color: #222;
//   }

//   h2 {
//     text-align: center;
//     color: #222;
//   }

//   & > div {
//     text-align: center;
//   }

//   a {
//     display: block;
//     text-align: center;
//     color: #222;
//     margin-bottom: 10px;
//   }

//   p {
//     max-width: 500px;
//     margin: 10px auto;
//     & > a {
//       display: inline;
//     }
//   }

  form {
    max-width: 900px;
    margin: 10px auto;
    border: 1px solid #ccc;
    padding: 20px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    border-radius: 3px;
    position: relative;

    .loading {
      text-align: center;
      display: block;
      position: absolute;
      background: url('https://media.giphy.com/media/130AxGoOaR6t0I/giphy.gif')
        center center;
      background-size: fill;
      font-size: 2em;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 50px 0 0 0;
      z-index: 2;
    }

?

    .error {
      display: flex;
      font-weight: bold;
      color: #800;
      flex-flow: row nowrap;
      justify-content: center;
    }
    pre {
      position: relative;
      border: 1px solid #ccc;
      background: rgba(0, 0, 0, 0.1);
      box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2);
      padding: 20px;
    }
  }
  button {
    margin: 0 10px;
    &[type='submit'] {
      ${btnPrimary};
    }
    &[type='button'] {
      ${btnDefault};
    }
  }
`
