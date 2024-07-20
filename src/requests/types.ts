export interface ICourseDataToCreateOrUpdate {
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  image?: File | null;
}

export interface ICoursePartDataToCreateOrUpdate {
  name: string;
  description?: string;
  imageUrl?: string;
  image?: File | null;
}

export interface IFetchUserDetails {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isVerifiedEmail: boolean;
}

export interface IUserDataToUpdate {
  firstName?: string;
  lastName?: string;
  email?: string;
}
