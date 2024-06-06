import React from 'react';
import { IInputUploadProps } from '../types';
import styles from './InputUpload.module.css';

export const InputUpload: React.FC<IInputUploadProps> = React.memo(
  ({ name, onChange, acceptFiles }) => {
    return (
      <>
        <label className={styles.uploadContainer}>
          + Upload
          <input
            name={name}
            type="file"
            onChange={onChange}
            accept={acceptFiles}
            className={styles.input}
          />
        </label>
      </>
    );
  }
);
