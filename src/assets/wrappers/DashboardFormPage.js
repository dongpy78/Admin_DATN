import styled from "styled-components";

const Wrapper = styled.section`
  border-radius: var(--border-radius);
  width: 100%;
  background-color: var(--background-third-color);

  padding: 3rem 2rem 4rem;

  .form-title {
    margin-bottom: 2rem;
    font-family: "Plus Jakarta Sans", sans-serif;
    color: var(--text-color);
  }

  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }

  .form-row {
    margin-bottom: 0;
  }

  .form-center {
    display: grid;
    row-gap: 1rem;
  }

  .form-input {
    background: var(--background-secondary-color);

    border: 1px solid #ccc;
    padding: 8px;
    color: var(--text-color);

    width: 100%;
    border-radius: 4px;
  }

  .form-input:disabled {
    background-color: #f0f0f0; /* Màu xám nhạt để phân biệt */
    color: #888; /* Chữ nhạt hơn */
    border-color: #ddd; /* Viền nhạt hơn */
    cursor: not-allowed; /* Con trỏ chuột kiểu "không cho phép" */
  }

  .form-btn {
    align-self: end;
    margin-top: 1rem;
    display: grid;
    place-items: center;
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }

  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

export default Wrapper;
