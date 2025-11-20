interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  deposit: number;
  isOfferItem: boolean;
  isFeatured?: boolean;
  isHotDeal?: boolean;
  rating: number;
  discount?: number;
  description: string;
  mainImage: string;
  coverPhoto?: string;
  manufacturer: string;
  categoryId: string;
  category: {name: string}?;
  inStock: number;
}

interface Merchant {
  id: string;
  name: string;
  email: string;
  description: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface SingleProductPageProps {
  params: {
    id: string;
    productSlug: string;
  };
}

type ProductInWishlist = {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
};

interface OtherImages {
  imageID: number;
  productID: number;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  password: string | null;
  role: string;
}

interface Order {
  id: string;
  adress: string;
  apartment: string;
  company: string;
  dateTime: string;
  rentalStartDate?: string;
  rentalDurationDays: number;
  fulfillmentMethod: "delivery" | "pickup";
  email: string;
  lastname: string;
  name: string;
  phone: string;
  postalCode: string;
  status: "processing" | "canceled" | "delivered";
  city: string;
  country: string;
  orderNotice: string?;
  total: number;
}

interface SingleProductBtnProps {
  product: Product;
  quantityCount: number;
}


interface Category {
  id: string;
  name: string;
}

interface WishListItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & import("next-auth").DefaultSession["user"];
  }

  interface User extends import("next-auth").DefaultUser {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}