import React from 'react';
import Label from '../Label/Label';
import { IInputUploadProps } from '../types';
import styles from './InputUpload.module.css';

export const InputUpload: React.FC<IInputUploadProps> = React.memo(
  ({ name, onChange, acceptFiles, maxSize }) => {
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
        <Label text={`Maximum size: ${maxSize}`} isRight isHint />
      </>
    );
  }
);
