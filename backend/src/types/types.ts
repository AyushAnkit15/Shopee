import { Request, Response, NextFunction } from "express";
export interface NewUser {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  DOB: Date;
  _id: string;
}

export interface Controller {
  (req: Request, res: Response, next: NextFunction): Promise<void | Response<
    any,
    Record<string, any>
  >>;
}

export interface NewProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export interface SearchQuery {
  search?: string;
  price?: number;
  category?: string;
  sort?: string;
  page?: number;
}

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export interface Revalidate {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
}

export interface OrderItem {
  name: string;
  photo: string;
  price: number;
  quantity: number;

  productId: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
}

export interface NewOrder {
  shippingInfo: ShippingInfo;
  user: string;
  subtotal: number;
  discount: number;
  shippingCharges: number;

  tax: number;
  total: number;

  orderItems: OrderItem[];
}
