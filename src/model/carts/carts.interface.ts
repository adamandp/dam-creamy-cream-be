export interface FindByUserCartDto {
  id: string;
  name: string;
  imageUrl: string | null;
  category: string;
  price: number;
  discountPrice: number | null;
  qty: number;
}
