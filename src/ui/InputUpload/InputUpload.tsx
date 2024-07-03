import React from 'react';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { IInputUploadProps } from '../types';
import styles from './InputUpload.module.css';
import { useTranslation } from 'react-i18next';

export const InputUpload: React.FC<IInputUploadProps> = React.memo(
  ({ name, onChange, acceptFiles }) => {
    const { t } = useTranslation();

    return (
      <>
        <label className={styles.uploadContainer}>
          <div className={styles.uploadTextWithIcon}>
            <MdOutlineCloudUpload size={26} />
            {t("upload")}
          </div>
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
