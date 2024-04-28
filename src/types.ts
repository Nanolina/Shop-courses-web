export interface ICourse {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  image: string;
}

export interface IOption {
  value: string;
  label: string;
}
