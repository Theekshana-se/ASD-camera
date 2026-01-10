// *********************
// Role of the component: Buy Now button that adds product to the cart and redirects to the checkout page
// Name of the component: BuyNowSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <BuyNowSingleProductBtn product={product} quantityCount={quantityCount} />
// Input parameters: SingleProductBtnProps interface
// Output: Button with buy now functionality
// *********************

"use client";
import { useProductStore } from "@/app/_zustand/store";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SmartButton from "./SmartButton";

const BuyNowSingleProductBtn = ({
  product,
  quantityCount,
}: SingleProductBtnProps) => {
  const router = useRouter();
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = async () => {
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount,
    });
    calculateTotals();
    toast.success("Product added to the cart");
    router.push("/checkout");
    // Keep loading indefinitely as we navigate away
    await new Promise(() => {}); 
  };
  return (
    <SmartButton
      onClick={handleAddToCart}
      className="w-[200px] text-lg uppercase max-[500px]:w-full bg-red-600 text-white border border-red-600 hover:bg-white hover:text-red-600"
      variant="primary"
    >
      Buy Now
    </SmartButton>
  );
};

export default BuyNowSingleProductBtn;
