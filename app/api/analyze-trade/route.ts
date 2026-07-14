import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const schemaHint = {
  instrument: 'string', direction: 'Long or Short', setup: 'string', session: 'London, New York, Asia or Other',
  entry: 'number or null', stopLoss: 'number or null', takeProfit: 'number or null', exit: 'number or null',
  concepts: ['FVG', 'Order Block'], confidence: '0 to 1', followedPlan: 'boolean or null',
  mistake: 'short specific mistake', improvement: 'short actionable improvement', review: '2-4 sentence coaching review'
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: 'OPENAI_API_KEY is not configured in Vercel.' }, { status: 503 });
    const { image, strategy = '', recentTrades = [] } = await request.json();
    if (!image) return NextResponse.json({ error: 'Image is required.' }, { status: 400 });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `You are TradeSea, a strict but helpful trading journal coach. Analyse the chart screenshot. Extract only information genuinely visible; use null when uncertain. Compare the trade against the user's written strategy. Never invent exact price levels. Return JSON only, with this shape: ${JSON.stringify(schemaHint)}.\n\nUSER STRATEGY:\n${strategy || 'No strategy has been saved yet.'}\n\nRECENT TRADE SUMMARIES:\n${JSON.stringify(recentTrades).slice(0, 6000)}\n\nThe review must explain whether the setup follows the strategy, identify the most important mistake, and give one practical improvement. This is retrospective journaling, not financial advice.`;
    const response = await client.responses.create({
      model: process.env.OPENAI_VISION_MODEL || 'gpt-4.1-mini',
      input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: image, detail: 'high' }] }]
    } as any);
    const text = response.output_text?.trim() || '{}';
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'AI analysis failed.' }, { status: 500 });
  }
}
