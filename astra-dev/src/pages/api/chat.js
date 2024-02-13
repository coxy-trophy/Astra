import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { OpenAIStream } from "@/utils/openai";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};



async function handler(req, res) {
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const authenticated = await verifyServerSideAuth(supabase, req.headers);
  const headers = getChatResponseHeaders();

  const apiKey = "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";

  if (!authenticated) {
    return new Response(`{ "message": "Unauthorized"}`, { status: 401, headers });
  }

  const body = await req.json();
  body.model = "gpt-3.5-turbo";


  body.messages = (body.messages || []).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  if (body.stream) {
    const stream = await OpenAIStream(body);
    return new Response(stream, { status: 200, headers });
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        // Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    const resText = await res.text();
    headers["Content-Type"] = "application/json";
    return new Response(resText, { status: 200, headers });
  }
}

export default handler;
