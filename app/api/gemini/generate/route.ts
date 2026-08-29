import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY environment variable is missing on server.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are the Google Workspace Client Portal AI Assistant.
You provide executive-level, clear, concise, and helpful answers regarding client projects, invoices, billing, contracts, technical specifications, and security audit logs.
Keep responses concise, professional, beautifully formatted with markdown bullet points where helpful.
Context provided: ${context || 'General Client Portal Help'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || 'No response generated.';

    return NextResponse.json({ text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to call Gemini API';
    console.error('Gemini API Route Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
