import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, studentProfile } = await req.json()

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    })

    const systemPrompt = `You are an expert education counselor for ApplyHelp. Help students find the right university and guide them through applications. Be specific, warm and actionable. Student profile: ${studentProfile ? JSON.stringify(studentProfile) : 'Not yet complete'}`

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    })

    const text = response.choices[0].message.content || ''
    return NextResponse.json({ message: text })

  } catch (error: any) {
    console.error('Advisor API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}