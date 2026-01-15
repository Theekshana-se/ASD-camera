// *********************
// Role of the component: Button for adding product to the cart on the single product page
// Name of the component: AddToCartSingleProductBtn.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <AddToCartSingleProductBtn product={product} quantityCount={quantityCount}  />
// Input parameters: SingleProductBtnProps interface
// Output: Button with adding to cart functionality
// *********************
"use client";



import React from "react";
import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import SmartButton from "./SmartButton";

const AddToCartSingleProductBtn = ({ product, quantityCount } : SingleProductBtnProps) => {
  const { addToCart, calculateTotals } = useProductStore();

  const handleAddToCart = async () => {
    // Artificial delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart({
      id: product?.id.toString(),
      title: product?.title,
      price: product?.price,
      image: product?.mainImage,
      amount: quantityCount
    });
    calculateTotals();
    toast.success("Product added to the cart");
  };
  return (
    <SmartButton
      onClick={handleAddToCart}
      className="w-[200px] text-lg uppercase max-[500px]:w-full bg-white text-red-600 border border-gray-300 hover:bg-red-600 hover:text-white hover:border-red-700"
      variant="outline"
    >
      Add to cart
    </SmartButton>
  );
};

export default AddToCartSingleProductBtn;
