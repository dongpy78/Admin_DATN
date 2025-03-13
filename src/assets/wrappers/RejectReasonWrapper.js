import styled from "styled-components";

const Wrapper = styled.section`
  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  /* Modal Content */
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-content h3 {
    margin-bottom: 15px;
    font-size: 18px;
    color: #333;
  }

  .modal-content textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 15px;
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .modal-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .modal-actions button[type="button"] {
    background: #ccc;
    color: #333;
  }

  .modal-actions button[type="submit"] {
    background: #dc3545;
    color: white;
  }

  .modal-actions button[type="submit"]:hover {
    background: #c82333;
  }
`;

export default Wrapper;
