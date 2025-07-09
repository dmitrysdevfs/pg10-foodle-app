import s from './Pagination.module.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleClick = page => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPages = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            className={`${s.pageBtn} ${i === currentPage ? s.active : ''}`}
            onClick={() => handleClick(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    return pages;
  };

  return <ul className={s.pagination}>{renderPages()}</ul>;
};

export default Pagination;
