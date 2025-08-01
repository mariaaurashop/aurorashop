import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!??"https://ycaheghfuknswbavqgfx.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!??"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljYWhlZ2hmdWtuc3diYXZxZ2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTM3MTMsImV4cCI6MjA2OTM2OTcxM30.G_Q3_SmFwClsJMiREVJjj6brysF62W8Ecm5CtpewLwQ";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!??"AIzaSyBw9Er1MYgz2TAYYaVk6dRqWuF7WCMFy9M";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: NextRequest) {
    try {
        const { message, user_id } = await req.json();

        if (!message || !user_id) {
            return NextResponse.json({ error: 'Missing message or user_id' }, { status: 400 });
        }

        // Save incoming message to Supabase
        const { data: userMsg, error: userMsgError } = await supabase
            .from('message')
            .insert([{ user_id, content: message, role: 'user' }])
            .select()

        if (userMsgError) {
            return NextResponse.json({ error: 'Error saving user message',userMsgError }, { status: 500 });
        }

        // Call Gemini API (2.9 flash)
        const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' ,"X-goog-api-key": GEMINI_API_KEY},
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: "Actúa como un asistente experto en moda y autfit, da recomendaciones de colores y todo tipo estilos. al final proporciona algunas de esta url de shein como recomendacion:https://www.shein.com/Y2K-Vintage-Strapless-Overbust-Corset-Boned-Lace-Up-Back-Bodyshaper-Crop-Bandeau-Top-Ladies-Sexy-The-Corset-Has-Padded-Cups-Structured-Body-For-Support-And-Style-Secure-Hook-And-Eye-Closure-And-A-Removable-Tie-For-Customization-Ideal-For-Everyday-Wear-And-Special-Occasions-p-66094188.html?mallCode=1&pageListType=4,https://www.shein.com/Women-s-Vacation-Contrast-Color-Sexy-Halter-Wrap-Bikini-Swimsuit-2pcs-Set-p-61364079.html?mallCode=1&pageListType=4,https://www.shein.com/Floreya-Square-Neck-Camisole-For-Women-Summer-Slim-Fit-Sleeveless-Casual-Tank-Top-For-Layering-Simple-Yet-Chic-Sporty-Style-Versatile-For-All-Seasons-p-62161999.html?mallCode=1&pageListType=4,https://www.shein.com/2-Piece-Minimalist-Sexy-Halter-Tie-Women-Leopard-Print-Bikini-Swimsuit-p-67673601.html?mallCode=1&pageListType=4" }]  // ← Tu instrucción del sistema
                },
                contents: [{ parts: [{ text: message }] }]
            })
        });

        if (!geminiRes.ok) {
            return NextResponse.json({ error: 'Gemini API error' }, { status: 500 });
        }

        const geminiData = await geminiRes.json();
        const aiMessage = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

        // Save AI response to Supabase
        const { data: aiMsg, error: aiMsgError } = await supabase
            .from('message')
            .insert([{ user_id, content: aiMessage, role: 'assistant' }])
            .select()
            .single();

        if (aiMsgError) {
            return NextResponse.json({ error: 'Error saving AI message' }, { status: 500 });
        }

        return NextResponse.json({ user: userMsg, ai: aiMsg },{status:200});
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}