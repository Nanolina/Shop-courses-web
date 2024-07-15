import {
  ButtonHTMLAttributes,
  ChangeEvent,
  HTMLInputTypeAttribute,
  ReactNode,
} from 'react';

export interface IOption {
  value: string;
  label: string;
}

export interface ISearch {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  hint?: string;
  icon?: any;
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
  text: string | number;
  isRequired?: boolean;
  isForHeader?: boolean;
  isCenter?: boolean;
  isRight?: boolean;
  isPadding?: boolean;
  isBold?: boolean;
  isBig?: boolean;
  isHint?: boolean;
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
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
}

export interface IChekBoxInputProps {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  id?: string;
  name?: string;
  checked?: boolean;
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
