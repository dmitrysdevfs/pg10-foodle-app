import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import s from './Modal.module.css';
import { cloneElement } from 'react';

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

          <ul className={s.actions}>
            {actions?.map((action, index) => {
              const { text, onClick, type = 'primary', element } = action;
              const btnClass =
                type === 'secondary' ? s.secondaryBtn : s.primaryBtn;

              return (
                <li key={index} className={s.actionItem}>
                  {element ? (
                    cloneElement(element, {
                      className: btnClass,
                    })
                  ) : (
                    <button
                      type="button"
                      className={btnClass}
                      onClick={onClick}
                    >
                      {text}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
