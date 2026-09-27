import { NextResponse } from 'next/server';
import { generateDailyOperationsBriefing } from '@/lib/ai-engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('organizationId') || 'org-apex-001';

  const briefing = generateDailyOperationsBriefing(orgId);

  return NextResponse.json({ briefing });
}
