import ArrowRight from '../../assets/icons/ArrowRightIcon.svg';
import ArrowLeft from '../../assets/icons/ArrowLeftIcon.svg';
import s from './Pagination.module.css';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleClick = page => {
    if (page !== currentPage) onPageChange(page);
  };

  const renderPages = () => {
    const pages = [];

    const addPage = page => {
      pages.push(
        <li key={page} className={s.pageItem}>
          <button
            className={`${s.pageBtn} ${page === currentPage ? s.active : ''}`}
            onClick={() => handleClick(page)}
          >
            {page}
          </button>
        </li>
      );
    };

    if (currentPage <= 4) {
      for (let i = 1; i <= Math.min(5, totalPages); i++) {
        addPage(i);
      }
      if (totalPages > 6)
        pages.push(
          <li key="dots1">
            <div className={s.dots}>...</div>
          </li>
        );
      if (totalPages > 5) addPage(totalPages);
    } else if (currentPage > 4 && currentPage < totalPages - 2) {
      addPage(1);
      pages.push(
        <li key="dots1" className={s.pageItem}>
          <div className={s.dots}>...</div>
        </li>
      );
      addPage(currentPage - 1);
      addPage(currentPage);
      addPage(currentPage + 1);
      pages.push(
        <li key="dots2" className={s.pageItem}>
          <div className={s.dots}>...</div>
        </li>
      );
      addPage(totalPages);
    } else {
      addPage(1);
      pages.push(
        <li key="dots1" className={s.pageItem}>
          <div className={s.dots}>...</div>
        </li>
      );
      for (let i = totalPages - 4; i <= totalPages; i++) {
        if (i > 1) addPage(i);
      }
    }

    return pages;
  };

  return (
    <>
      {totalPages > 1 && (
        <div className={s.pagination}>
          <button
            className={s.arrow}
            onClick={() => handleClick(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
          >
            <ArrowLeft />
          </button>

          <ul className={s.pages}>{renderPages()}</ul>

          <li>
            <button
              className={s.arrow}
              onClick={() => handleClick(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next Page"
            >
              <ArrowRight />
            </button>
          </li>
        </div>
      )}
    </>
  );
};

export default Pagination;
