import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL as API_BASE } from '@/lib/config';

function getAuthHeader(request: NextRequest): Record<string, string> {
    const token = request.headers.get('authorization');
    return token ? { Authorization: token } : {};
}

// GET /api/products/[id]
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const response = await fetch(`${API_BASE}/products/${id}`, {
            headers: { 'accept': '*/*', ...getAuthHeader(request) },
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: 'Error al obtener producto' }, { status: 500 });
    }
}

// PATCH /api/products/[id]
export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(request),
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: 'Error al actualizar producto' }, { status: 500 });
    }
}

// DELETE /api/products/[id]
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const response = await fetch(`${API_BASE}/products/${id}`, {
            method: 'DELETE',
            headers: { ...getAuthHeader(request) },
        });
        if (response.status === 200 || response.status === 204) {
            return NextResponse.json({ success: true }, { status: 200 });
        }
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: 'Error al eliminar producto' }, { status: 500 });
    }
}
