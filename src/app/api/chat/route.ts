import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Fetch opportunities context
    const supabase = await createClient();
    const { data: opportunities } = await supabase
      .from('opportunities')
      .select('title, organization, category, deadline, eligibility, description')
      .order('created_at', { ascending: false })
      .limit(50);
      
    let contextData = "No opportunities available right now.";
    if (opportunities && opportunities.length > 0) {
      contextData = opportunities.map(o => 
        `Title: ${o.title}, Org: ${o.organization}, Category: ${o.category}, Deadline: ${o.deadline}, Eligibility: ${o.eligibility}, Desc: ${o.description}`
      ).join('\n---\n');
    }

    const systemPrompt = `You are "Opportunity AI", an assistant for a student platform. 
You answer questions about the following available opportunities.
IMPORTANT: You must NOT invent deadlines, companies, eligibility or opportunities.
If the required information does not exist in the database, say: "I couldn't find a verified opportunity for that request."
Use the following context to answer the user's prompt. Keep it concise, helpful, and simple.

AVAILABLE OPPORTUNITIES CONTEXT:
${contextData}`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      systemPrompt,
      { text: `User request: ${prompt}` }
    ]);
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
