export interface Product {
  Id: string;
  ProductCode: string;
  Name: string;
  CategoryId: string;
  CategoryName: string;
  Description: string;
  Price: number;
  Size: string;
  Quantity: number;
  IsDeleted: boolean;
  Image: string[];
  Thumbnail: string[];
}
