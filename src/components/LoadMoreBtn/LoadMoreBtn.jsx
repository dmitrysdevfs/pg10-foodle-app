import s from './LoadMoreBtn.module.css';

const LoadMoreBtn = ({ onClick }) => {
  return (
    <div className={s.loadMoreContainer}>
      <button onClick={onClick} className={s.loadMoreBtn}>
        Load More
      </button>
    </div>
  );
};

export default LoadMoreBtn;
