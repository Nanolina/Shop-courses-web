export interface IOption {
  value: string;
  label: string;
}

export interface IImageUploadProps {
  onImageChange: (file: File | null) => void;
}
