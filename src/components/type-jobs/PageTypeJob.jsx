import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../../assets/wrappers/PageBtnContainer";

const PageTypeJob = ({ numOfPages, currentPage, handlePageChange }) => {
  const renderPageButtons = () => {
    const pageButtons = [];

    // Add the first page button
    pageButtons.push(
      <button
        className={`btn page-btn ${currentPage === 1 && "active"}`}
        key={1}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Add dots before current page if needed
    if (currentPage > 3) {
      pageButtons.push(
        <span className="page-btn dots" key="dots-1">
          ....
        </span>
      );
    }

    // One before current page
    if (currentPage > 2) {
      pageButtons.push(
        <button
          className="btn page-btn"
          key={currentPage - 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      );
    }

    // Current page (only add if not 1 or numOfPages)
    if (currentPage !== 1 && currentPage !== numOfPages) {
      pageButtons.push(
        <button
          className="btn page-btn active"
          key={currentPage}
          onClick={() => handlePageChange(currentPage)}
        >
          {currentPage}
        </button>
      );
    }

    // One after current page
    if (currentPage < numOfPages - 1) {
      pageButtons.push(
        <button
          className="btn page-btn"
          key={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      );
    }

    // Add dots after current page if needed
    if (currentPage < numOfPages - 2) {
      pageButtons.push(
        <span className="page-btn dots" key="dots+1">
          ....
        </span>
      );
    }

    // Add the last page button (only if not already added as current page)
    if (numOfPages !== 1) {
      pageButtons.push(
        <button
          className={`btn page-btn ${currentPage === numOfPages && "active"}`}
          key={numOfPages}
          onClick={() => handlePageChange(numOfPages)}
        >
          {numOfPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <Wrapper>
      <button
        className="btn prev-btn"
        onClick={() => {
          let prevPage = currentPage - 1;
          if (prevPage < 1) prevPage = numOfPages;
          handlePageChange(prevPage);
        }}
      >
        <HiChevronDoubleLeft />
        prev
      </button>

      <div className="btn-container">{renderPageButtons()}</div>

      <button
        className="btn next-btn"
        onClick={() => {
          let nextPage = currentPage + 1;
          if (nextPage > numOfPages) nextPage = 1;
          handlePageChange(nextPage);
        }}
      >
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageTypeJob;
