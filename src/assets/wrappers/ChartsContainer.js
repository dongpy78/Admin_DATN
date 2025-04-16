import styled from "styled-components";

const Wrapper = styled.section`
  /* margin-top: 4rem; */
  background-color: var(--background-third-color);
  font-family: "Plus Jakarta Sans", sans-serif;

  padding: 2rem;
  text-align: left;
  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--primary-500);
    font-size: 1.25rem;
    cursor: pointer;
  }
  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
    color: var(--text-color);
    font-family: "Plus Jakarta Sans", sans-serif;
  }
`;

export default Wrapper;
