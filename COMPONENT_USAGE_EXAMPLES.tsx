/**
 * USAGE EXAMPLES FOR NEW LOADING COMPONENTS
 * 
 * This file shows how to use the new SmartLink and SmartButton components
 * throughout your application for better user experience.
 */

import SmartLink from "@/components/SmartLink";
import SmartButton from "@/components/SmartButton";
import { useState } from "react";

// Dummy functions for examples
const submitForm = async () => {};
const addToCart = async (id: any) => {};
const deleteItem = async (id: any) => {};
const updateItem = async (data: any) => {};
const data = {};
const id = "1";

// ============================================
// EXAMPLE 1: Navigation Links
// ============================================
export function NavigationExample() {
  return (
    <nav>
      {/* Replace regular Link with SmartLink for instant feedback */}
      <SmartLink 
        href="/products" 
        className="text-gray-700 hover:text-red-500"
      >
        Products
      </SmartLink>
      
      <SmartLink 
        href="/categories" 
        className="text-gray-700 hover:text-red-500"
      >
        Categories
      </SmartLink>
    </nav>
  );
}

// ============================================
// EXAMPLE 2: Action Buttons
// ============================================
export function ButtonExamples() {
  const handleAddToCart = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Added to cart!");
  };

  const handleCheckout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Proceeding to checkout...");
  };

  return (
    <div className="space-y-4">
      {/* Primary button with auto-loading state */}
      <SmartButton 
        variant="primary" 
        size="md"
        onClick={handleAddToCart}
      >
        Add to Cart
      </SmartButton>

      {/* Secondary button */}
      <SmartButton 
        variant="secondary" 
        size="lg"
        onClick={handleCheckout}
      >
        Checkout
      </SmartButton>

      {/* Outline button */}
      <SmartButton 
        variant="outline" 
        size="sm"
      >
        View Details
      </SmartButton>

      {/* Ghost button */}
      <SmartButton 
        variant="ghost"
      >
        Cancel
      </SmartButton>
    </div>
  );
}

// ============================================
// EXAMPLE 3: Form Submission
// ============================================
export function FormExample() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Your form submission logic
      await submitForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input type="text" placeholder="Name" />
      <input type="email" placeholder="Email" />
      
      {/* Submit button with external loading state */}
      <SmartButton 
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </SmartButton>
    </form>
  );
}

// ============================================
// EXAMPLE 4: Product Card
// ============================================
export function ProductCardExample({ product }: { product: any }) {
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await addToCart(product.id);
      // Show success message
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {/* View details link with ripple effect */}
      <SmartLink 
        href={`/products/${product.id}`}
        className="text-blue-600 hover:underline"
      >
        View Details
      </SmartLink>
      
      {/* Add to cart button with loading state */}
      <SmartButton
        variant="primary"
        onClick={handleAddToCart}
        loading={addingToCart}
        className="w-full mt-2"
      >
        Add to Cart
      </SmartButton>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Admin Dashboard Actions
// ============================================
export function AdminActionsExample() {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    
    // SmartButton automatically shows loading state
    await deleteItem(id);
  };

  const handleUpdate = async (data: any) => {
    // SmartButton automatically shows loading state
    await updateItem(data);
  };

  return (
    <div className="flex gap-2">
      <SmartButton
        variant="primary"
        size="sm"
        onClick={() => handleUpdate(data)}
      >
        Update
      </SmartButton>
      
      <SmartButton
        variant="outline"
        size="sm"
        onClick={() => handleDelete(id)}
      >
        Delete
      </SmartButton>
    </div>
  );
}

// ============================================
// BEST PRACTICES
// ============================================

/**
 * 1. USE SMARTLINK FOR ALL NAVIGATION
 *    - Provides instant visual feedback
 *    - Enables prefetching by default
 *    - Shows ripple effect on click
 * 
 * 2. USE SMARTBUTTON FOR ALL ACTIONS
 *    - Prevents double-clicks automatically
 *    - Shows loading spinner during async operations
 *    - Provides consistent styling
 * 
 * 3. LOADING STATES ARE AUTOMATIC
 *    - SmartButton detects async onClick handlers
 *    - Shows loading spinner automatically
 *    - Re-enables after operation completes
 * 
 * 4. EXTERNAL LOADING STATES
 *    - Use the 'loading' prop when you need manual control
 *    - Useful for form submissions or complex flows
 * 
 * 5. VARIANTS AND SIZES
 *    - primary: Main actions (Add to Cart, Submit, etc.)
 *    - secondary: Alternative actions
 *    - outline: Less prominent actions
 *    - ghost: Minimal actions (Cancel, Close, etc.)
 */
