import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  let users = db.users.filter((u) => u.organizationId === orgId || orgId === 'org-dpw-rwanda');
  return NextResponse.json({ total: users.length, users });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      organizationId: body.organizationId || 'org-apex-001',
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone || '+250 780 000 000',
      role: body.role || 'OPERATIONS_EXECUTIVE',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    db.users.unshift(newUser);
    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, status, role } = body;
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (status) user.status = status;
    if (role) user.role = role;

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
