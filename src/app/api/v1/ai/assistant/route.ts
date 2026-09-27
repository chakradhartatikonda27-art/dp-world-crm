import { NextResponse } from 'next/server';
import { queryLogisticsAIAssistant } from '@/lib/ai-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, organizationId } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const reply = queryLogisticsAIAssistant(prompt, organizationId || 'org-apex-001');

    return NextResponse.json({
      query: prompt,
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'AI Assistant failed' }, { status: 500 });
  }
}
