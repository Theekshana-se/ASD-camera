import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for on-demand cache revalidation
 * 
 * Usage:
 * POST /api/revalidate
 * Body: { path: '/products', tag: 'products', secret: 'your-secret' }
 * 
 * This allows you to invalidate cache when data changes (e.g., after product update)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path, tag, secret } = body;

        // Verify secret to prevent unauthorized revalidation
        // In production, use environment variable
        const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'dev-secret-change-in-production';

        if (secret !== REVALIDATE_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret' },
                { status: 401 }
            );
        }

        // Revalidate by path
        if (path) {
            revalidatePath(path);
            console.log(`✅ Revalidated path: ${path}`);
        }

        // Revalidate by tag
        if (tag) {
            revalidateTag(tag, 'default');
            console.log(`✅ Revalidated tag: ${tag}`);
        }

        if (!path && !tag) {
            return NextResponse.json(
                { error: 'Please provide either path or tag' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            revalidated: true,
            path: path || null,
            tag: tag || null,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json(
            { error: 'Error revalidating cache' },
            { status: 500 }
        );
    }
}

/**
 * GET endpoint to check revalidation API status
 */
export async function GET() {
    return NextResponse.json({
        status: 'active',
        message: 'Revalidation API is working',
        usage: {
            method: 'POST',
            body: {
                secret: 'your-revalidate-secret',
                path: '/products (optional)',
                tag: 'products (optional)',
            },
        },
    });
}
