import React, { useEffect } from 'react';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IMessageBox } from '../types';

export const MessageBox: React.FC<IMessageBox> = React.memo(
  ({ errorMessage = '', successMessage = '' }) => {
    useEffect(() => {
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }, [errorMessage]);

    useEffect(() => {
      if (successMessage) {
        toast.success(successMessage);
      }
    }, [successMessage]);

    return (
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    );
  }
);
