import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://apiviralstore.viralshopbo.com';

// POST /api/products/[id]/images
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const token       = request.headers.get('authorization');
        const contentType = request.headers.get('content-type') ?? '';

        const rawBody = await request.arrayBuffer();

        const response = await fetch(`${API_BASE}/products/${id}/images`, {
            method: 'POST',
            headers: {
                'accept':       '*/*',
                'content-type': contentType,
                ...(token ? { Authorization: token } : {}),
            },
            body: rawBody,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (err) {
        console.warn('[images upload] proxy error:', err);
        return NextResponse.json({ message: 'Error al subir archivos' }, { status: 500 });
    }
}
