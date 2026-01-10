"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductItem from "@/components/ProductItem";
import apiClient from "@/lib/api";

export default function ProductTestPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Show which URL we're calling
        const url = "/api/products?filters[isFeatured][$equals]=true&page=1";
        setApiUrl(`${apiClient.baseUrl}${url}`);
        
        const response = await apiClient.get(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          setProducts(Array.isArray(data) ? data : []);
        } else {
          const text = await response.text();
          setError(`API Error: ${response.status} - ${text}`);
        }
      } catch (err: any) {
        setError(`Fetch Error: ${err.message}`);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Product Fetching Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Info</h2>
          <p className="mb-2">
            <strong>API URL:</strong> <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{apiUrl}</span>
          </p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            {loading && <span className="text-blue-600">Loading...</span>}
            {error && <span className="text-red-600">Error</span>}
            {!loading && !error && <span className="text-green-600">Success</span>}
          </p>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-mono text-sm">{error}</p>
            </div>
          )}
        </div>

        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Products Fetched: {products.length}</h2>
              {products.length > 0 && (
                <details className="mb-4">
                  <summary className="cursor-pointer font-medium text-blue-600 hover:text-blue-800">
                    View Raw Data (First Product)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto text-xs">
                    {JSON.stringify(products[0], null, 2)}
                  </pre>
                </details>
              )}
            </div>

            {products.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-4">ProductCard Component Test</h2>
                <div className="grid grid-cols-4 gap-6 mb-12 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                  {products.slice(0, 4).map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                <h2 className="text-2xl font-bold mb-4">ProductItem Component Test</h2>
                <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
                  {products.slice(0, 4).map((product) => (
                    <ProductItem key={product.id} product={product} color="black" />
                  ))}
                </div>
              </>
            )}

            {products.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Products Found</h3>
                <p className="text-yellow-700">
                  The API returned successfully but no products have <code className="bg-yellow-100 px-1">isFeatured = true</code>.
                  Check your database to ensure products are marked as featured.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
