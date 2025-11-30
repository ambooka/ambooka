// supabase/functions/portfolio-chat/index.ts
// Production-ready Supabase Edge Function for Portfolio Chat
// Compatible with Gemini AI 1.5 Flash and latest Supabase standards
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.21.0';
// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
// 🎯 PORTFOLIO CONTEXT - CUSTOMIZE THIS WITH YOUR INFORMATION
const PORTFOLIO_CONTEXT = `
You are an AI assistant for a professional portfolio website. Your role is to help visitors learn about the portfolio owner in a friendly, professional, and engaging manner.

ABOUT THE PORTFOLIO OWNER:
Name: [Your Full Name]
Title: [Your Professional Title/Role]
Location: [Your City, Country]
Years of Experience: [X years]

PROFESSIONAL SUMMARY:
[Brief 2-3 sentence summary of your professional background and expertise]

TECHNICAL SKILLS:
Frontend: [e.g., React, Next.js, TypeScript, Tailwind CSS]
Backend: [e.g., Node.js, Python, PostgreSQL, Supabase]
DevOps: [e.g., Docker, AWS, CI/CD, Vercel]
Other: [e.g., AI/ML, Mobile Development, etc.]

KEY PROJECTS:
1. [Project Name]: [Brief description and technologies used]
2. [Project Name]: [Brief description and technologies used]
3. [Project Name]: [Brief description and technologies used]

EDUCATION:
- [Degree] in [Field] from [University], [Year]
- [Certifications or additional training]

PROFESSIONAL EXPERIENCE:
- [Current/Recent Role] at [Company] ([Year-Present]): [Brief description]
- [Previous Role] at [Company] ([Year-Year]): [Brief description]

INTERESTS & SPECIALIZATIONS:
[List areas of particular interest or expertise]

CONTACT & AVAILABILITY:
- Email: [your.email@example.com]
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [Your GitHub Profile]
- Currently [Open/Not open] to new opportunities

CONVERSATION GUIDELINES:
- Be warm, professional, and enthusiastic about the portfolio owner's work
- Provide specific, detailed answers based on the context above
- If asked about something not in the portfolio, politely redirect to relevant portfolio information
- Keep responses concise but informative (2-4 sentences typically)
- Use a conversational tone while maintaining professionalism
- If someone asks about availability for work/collaboration, mention the contact preference above
- Highlight achievements and unique value propositions naturally in conversation

Remember: You represent this professional's personal brand. Be authentic, helpful, and showcase their expertise effectively.
`;
// Main serve function
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  const startTime = Date.now();
  try {
    // Parse and validate request body
    const { messages } = await req.json();
    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid request',
        message: 'Messages array is required and must not be empty'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Validate message structure
    const hasValidMessages = messages.every((msg)=>msg.role && msg.content && typeof msg.content === 'string');
    if (!hasValidMessages) {
      return new Response(JSON.stringify({
        error: 'Invalid message format',
        message: 'Each message must have role and content fields'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return new Response(JSON.stringify({
        error: 'Configuration error',
        message: 'API key not configured. Please contact the administrator.'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    // Configure the model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    });
    // Build conversation history with portfolio context
    const conversationHistory = [
      {
        role: 'user',
        parts: [
          {
            text: PORTFOLIO_CONTEXT
          }
        ]
      },
      {
        role: 'model',
        parts: [
          {
            text: 'I understand. I will assist visitors with information about this portfolio professionally, warmly, and helpfully. I will provide specific details about their experience, skills, projects, and background while maintaining a conversational and engaging tone.'
          }
        ]
      }
    ];
    // Add user messages to history (convert to Gemini format)
    messages.forEach((msg)=>{
      conversationHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [
          {
            text: msg.content
          }
        ]
      });
    });
    // Get the latest user message
    const latestMessage = messages[messages.length - 1].content;
    console.log(`Processing message: "${latestMessage.substring(0, 50)}..."`);
    // Start a chat session with history (excluding last message)
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1)
    });
    // Send message and get streaming response
    const result = await chat.sendMessageStream(latestMessage);
    // Create a readable stream for the response
    const stream = new ReadableStream({
      async start (controller) {
        try {
          let totalChunks = 0;
          for await (const chunk of result.stream){
            const text = chunk.text();
            if (text) {
              totalChunks++;
              // Create response object matching Gemini's streaming format
              const responseChunk = {
                candidates: [
                  {
                    content: {
                      parts: [
                        {
                          text
                        }
                      ],
                      role: 'model'
                    },
                    finishReason: chunk.candidates?.[0]?.finishReason || null,
                    index: 0,
                    safetyRatings: chunk.candidates?.[0]?.safetyRatings || []
                  }
                ]
              };
              // Send the chunk as a JSON line (newline-delimited JSON)
              const line = JSON.stringify(responseChunk) + '\n';
              controller.enqueue(new TextEncoder().encode(line));
            }
          }
          const endTime = Date.now();
          console.log(`Completed streaming response: ${totalChunks} chunks in ${endTime - startTime}ms`);
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          // Send error as a chunk
          const errorChunk = {
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text: 'I apologize, but I encountered an error while processing your request. Please try again.'
                    }
                  ],
                  role: 'model'
                },
                finishReason: 'ERROR',
                index: 0
              }
            ]
          };
          controller.enqueue(new TextEncoder().encode(JSON.stringify(errorChunk) + '\n'));
          controller.close();
        }
      }
    });
    // Return streaming response
    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    const endTime = Date.now();
    console.error(`Error in portfolio-chat function (${endTime - startTime}ms):`, error);
    // Determine error type and return appropriate response
    let errorMessage = 'An unexpected error occurred while processing your request.';
    let statusCode = 500;
    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON in request body';
      statusCode = 400;
    } else if (error.message?.includes('API key')) {
      errorMessage = 'API configuration error. Please contact support.';
      statusCode = 500;
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'Service temporarily unavailable due to high demand. Please try again in a moment.';
      statusCode = 429;
    }
    return new Response(JSON.stringify({
      error: 'Request failed',
      message: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}) /* 
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Set GEMINI_API_KEY in Supabase Dashboard:
 *    - Go to Settings → Edge Functions → Environment Variables
 *    - Add: GEMINI_API_KEY = your_gemini_api_key
 * 
 * 2. Deploy the function:
 *    supabase functions deploy portfolio-chat
 * 
 * 3. Test the function:
 *    curl -i --location --request POST \
 *      'https://YOUR_PROJECT.supabase.co/functions/v1/portfolio-chat' \
 *      --header 'Authorization: Bearer YOUR_ANON_KEY' \
 *      --header 'Content-Type: application/json' \
 *      --data '{"messages":[{"role":"user","content":"Hello"}]}'
 * 
 * 4. Monitor logs:
 *    supabase functions logs portfolio-chat --follow
 */ ;
