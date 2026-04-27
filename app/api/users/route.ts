import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL as API_BASE } from '@/lib/config';

function getAuthHeader(request: NextRequest): Record<string, string> {
    const token = request.headers.get('authorization');
    return token ? { Authorization: token } : {};
}

// GET /api/users?page=1&size=10

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const size = searchParams.get('size') || '10';

    const response = await fetch(`${API_BASE}/users?page=${page}&size=${size}`, {
        headers: {
            'accept': '*/*',
            ...getAuthHeader(request),
        },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
}

// POST /api/users
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader(request),
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: 'Error al crear usuario' }, { status: 500 });
    }
}
