import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import s from './Modal.module.css';

const Modal = ({ open, onOpenChange, title, message, actions }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <Dialog.Content className={s.modal}>
          <Dialog.Close asChild>
            <button className={s.closeBtn} aria-label="Close">
              <X size={20} />
            </button>
          </Dialog.Close>

          {title && <Dialog.Title className={s.title}>{title}</Dialog.Title>}
          {message && (
            <Dialog.Description className={s.message}>
              {message}
            </Dialog.Description>
          )}

          <div className={s.actions}>
            {actions?.map(({ text, onClick, type = 'primary' }, index) => (
              <button
                key={index}
                className={type === 'secondary' ? s.secondaryBtn : s.primaryBtn}
                onClick={onClick}
              >
                {text}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
