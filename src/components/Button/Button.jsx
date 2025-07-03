import s from './Button.module.css';
import clsx from 'clsx';

const LoadMoreBtn = ({
  className,
  onClick,
  text,
  type = 'submit',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx(s.baseStyle, className)}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
export default LoadMoreBtn;
