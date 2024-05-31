import { ButtonHTMLAttributes, ChangeEvent, ReactNode } from 'react';

export interface IOption {
  value: string;
  label: string;
}

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export interface IContainerProps {
  grayContainer?: boolean;
  children: ReactNode;
}

export interface IImagePreviewProps {
  imagePreview: string;
  removeImage: () => void;
}

export interface ILabelProps {
  text: string;
  isRequired?: boolean;
  isForHeader?: boolean;
  isCenter?: boolean;
  isRight?: boolean;
}

export interface ISelectProps {
  type: string;
  selectValue: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: IOption[];
  isRequired?: boolean;
}

export interface ITextareaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  isRequired?: boolean;
}

export interface ITextInputProps {
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  isRequired?: boolean;
}

export interface IInputUploadProps {
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  acceptFiles: string;
}

export interface IMessageBox {
  errorMessage?: string;
  successMessage?: string;
}

export interface IVideoPreviewProps {
  videoPreview: string;
  removeVideo: () => void;
}
