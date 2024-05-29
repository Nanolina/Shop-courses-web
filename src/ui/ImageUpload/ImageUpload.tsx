import React from 'react';
import { IImageUploadProps } from '../types';
import styles from './ImageUpload.module.css';

function ImageUpload({ onImageChange }: IImageUploadProps) {
  // Function to simulate clicking on a hidden input
  const handleButtonClick = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    onImageChange(file);
  };

  return (
    <div className={styles.container}>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className={styles.hiddenInput} // Hiding the default input
      />
      <button onClick={handleButtonClick} className={styles.button}>
        Upload
      </button>
    </div>
  );
}

export default ImageUpload;
