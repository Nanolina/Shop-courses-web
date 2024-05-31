import { useEffect, useState } from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, content, confirm }: any) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img
          className={styles.image}
          src="https://regmedia.co.uk/2022/08/04/shutterstock_delete_trash_button.jpg"
          alt="delete"
        ></img>
        {content}
        <div className={styles.containerBtn}>
          <button onClick={onClose} className={styles.btn}>
            Закрыть
          </button>
          <button onClick={confirm} className={styles.btn_del}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

//Using modal: 
//import Modal from '../../components/ModalWindow/Modal';
//import React, { useState } from 'react'; // UseState for Modal!

//const [modalOpen, setModalOpen] = useState(false);

// function confirm() {
//   console.log('Work!');
// }

/* <div>
<button onClick={() => setModalOpen(true)}>
  Открыть модальное окно
</button>
<Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  content={<><h2>Delete course?</h2><p>Вы уверены, что хотите удалить это?</p></>}
  confirm={confirm}
/>
</div> */