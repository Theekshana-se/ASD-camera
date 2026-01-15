import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import apiClient from './api';

/**
 * Cached product fetcher using React cache for request deduplication
 * Multiple calls to this function in the same request will only make one API call
 */
export const getCachedProducts = cache(async (mode?: string) => {
    const endpoint = mode ? `/api/products?mode=${mode}` : '/api/products';
    const res = await apiClient.get(endpoint, {
        next: { revalidate: 300 } // 5 minutes
    });

    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }

    return res.json();
});

/**
 * Cached single product fetcher with longer revalidation time
 */
export const getCachedProduct = cache(async (slug: string) => {
    const res = await apiClient.get(`/api/slugs/${slug}`, {
        next: { revalidate: 600 } // 10 minutes - products don't change as often
    });

    if (!res.ok) {
        throw new Error('Failed to fetch product');
    }

    return res.json();
});

/**
 * Cached product images fetcher
 */
export const getCachedProductImages = cache(async (productId: string) => {
    const res = await apiClient.get(`/api/images/${productId}`, {
        next: { revalidate: 3600 } // 1 hour - images rarely change
    });

    if (!res.ok) {
        return [];
    }

    return res.json();
});

/**
 * Cached categories fetcher
 */
export const getCachedCategories = cache(async () => {
    const res = await apiClient.get('/api/categories', {
        next: { revalidate: 1800 } // 30 minutes
    });

    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }

    return res.json();
});

/**
 * Cached brands fetcher
 */
export const getCachedBrands = cache(async () => {
    const res = await apiClient.get('/api/brands', {
        next: { revalidate: 1800 } // 30 minutes
    });

    if (!res.ok) {
        throw new Error('Failed to fetch brands');
    }

    return res.json();
});

/**
 * Advanced caching with tags for on-demand revalidation
 * Use this for data that needs to be invalidated programmatically
 */
export const getProductsWithTags = unstable_cache(
    async (mode?: string) => {
        const endpoint = mode ? `/api/products?mode=${mode}` : '/api/products';
        const res = await fetch(`${apiClient.baseUrl}${endpoint}`);

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        return res.json();
    },
    ['products-list'], // Cache key
    {
        revalidate: 300, // 5 minutes
        tags: ['products'], // Tag for invalidation
    }
);

/**
 * Get product by ID with caching and tags
 */
export const getProductByIdWithTags = unstable_cache(
    async (id: string) => {
        const res = await fetch(`${apiClient.baseUrl}/api/products/${id}`);

        if (!res.ok) {
            throw new Error('Failed to fetch product');
        }

        return res.json();
    },
    ['product-detail'],
    {
        revalidate: 600,
        tags: ['products', 'product-detail'],
    }
);
