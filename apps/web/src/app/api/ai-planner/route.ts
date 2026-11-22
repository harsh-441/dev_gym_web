import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedFitnessPlan, validateAIPlannerInput, AIFitnessPlannerInput } from '@parshuram/shared';

export async function POST(req: NextRequest) {
  try {
    const body: AIFitnessPlannerInput = await req.json();

    const validation = validateAIPlannerInput(body);
    if (!validation.isValid) {
      return NextResponse.json({ error: 'Validation failed', details: validation.errors }, { status: 400 });
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (openAiApiKey && openAiApiKey.trim() !== '') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiApiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert sports nutritionist and strength architect for Parshuram Fitness Club (Owner: Kapil Dev). Generate a detailed, culturally rich Indian nutrition and progressive resistance workout plan adhering strictly to safety guidelines. Return strictly valid JSON.'
              },
              {
                role: 'user',
                content: JSON.stringify(body)
              }
            ],
            response_format: { type: 'json_object' }
          })
        });

        if (response.ok) {
          const completion = await response.json();
          const parsed = JSON.parse(completion.choices[0].message.content);
          return NextResponse.json({ source: 'openai', plan: parsed });
        }
      } catch (openAiError) {
        console.warn('OpenAI API request failed or timed out. Falling back to deterministic engine:', openAiError);
      }
    }

    // High accuracy deterministic fallback engine (adhering to Mifflin-St Jeor, Indian staples, safety rules)
    const fallbackPlan = generatePersonalizedFitnessPlan(body);
    return NextResponse.json({ source: 'deterministic_engine', plan: fallbackPlan });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
