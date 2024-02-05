import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Head from "next/head";
import { createParser } from "eventsource-parser";

// const SYSTEM_MESSAGE =
//   "You are Astra, A helpful and versatile AI created by Coxwell using state of the art machine learning models and API's, Coxwell is a software engineering student at ipmc, believe me when I say He is the real deal";

const SYSTEM_MESSAGE = ` 🌟 Welcome to Astra AI! 🌟 Hello there! I'm Astra, your friendly AI created by Coxwell, a passionate software engineering student at IPMC. 
I'm here to make your experience enjoyable and assist you in any way I can. 
Everything is running smoothly at the moment.
If you encounter any issues, don't hesitate to let me know. 
I'm here to help! Feel free to ask me anything! 
Whether it's about technology, fun facts, or a simple chat, I'm at your service. 
Try asking, "What's the latest tech news?" or "Tell me a fun fact." I am constantly learning, 
and if I ever do not have an answer, I will be upfront about it. Your feedback is invaluable for my improvement. 
To enhance your experience, I might personalize responses based on our previous interactions.
Your data is handled securely and in accordance with privacy standards. Let me know your thoughts! 
Share feedback[here] or reply with "feedback." 
Your input helps me grow. We can chat in any style you prefer! 
Just let me know your preference, and I will adjust accordingly. 
Oops! It seems I didn't catch that. Could you please rephrase your question? 
If you're ever stuck, don't hesitate to ask for assistance Need more help ? 
Reach out to our customer support at[support@email.com] or visit our[help center]. 
By using this service, you agree to our[terms of use]. 
We strictly adhere to all relevant regulations for a secure and reliable experience. 
Thanks for choosing Astra as your AI companion! Feel free to start a conversation anytime. 
Best, Astra 🚀`;

// To use a specific message, you can call SYSTEM_MESSAGES.welcome or SYSTEM_MESSAGES.update or SYSTEM_MESSAGES.downtime, etc.

export default function Home() {
  // const apiKey = useState("");
  const apiKey = "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";
  // const apiKey = process.env.local.OPENAI_API_KEY;
  // const { serverRuntimeConfig } = getConfig();
  // const apiKey = serverRuntimeConfig.NEXT_PUBLIC_API_KEY;

  // setApiKey(process.env.OPENAI_API_KEY)

  // Now you can use the apiKey variable wherever needed in your code

  // const [botMessage, setBotMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: SYSTEM_MESSAGE,
    },
  ]);
  const [userMessage, setUserMessage] = useState("");

  const API_URL = "https://api.openai.com/v1/chat/completions";

  // const [userMessage, setUserMessage] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendRequest();
    }
  };

  const sendRequest = async () => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          // "X-RapidAPI-Key": apiKey,
          // "X-RapidAPI-Host": "chatgpt-api8.p.rapidapi.com",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });
      // console.log(process.env);
      // console.log("API Key:", process.env.NEXT_PUBLIC_API_KEY);

      // try { const response = await fetch("https://api.openai.com/v1/chat/completions", {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      //   },
      //   method: "POST",
      //   body: JSON.stringify(body),
      //   model: "gpt-3.5-turbo",
      //     messages: updatedMessages,
      //     stream: true,
      // });

      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        } else {
          return "";
        }
      });

      // eslint-disable-next-line
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Astra - Your Friendly neighborhood AI</title>
      </Head>
      <div className="flex flex-col h-screen w-screen">
        {/* Navbar */}
        <nav className="shadow px-4 py-2 flex flex-row justify-between items-center">
          <div className="text-xl font-bold">Astra</div>
          <div>
            {/* <input
              type="password"
              className="border p-1 rounded"
              onChange={(e) => setApiKey(e.target.value)}
              value={apiKey}
              placeholder="Paste Api Key Here"
            ></input> */}
          </div>
        </nav>

        {/* Message History */}
        <div className="flex-1 overflow-y-scroll">
          <div className="w-full max-w-screen-md mx-auto px-4">
            {messages
              .filter((message) => message.role !== "system")
              .map((message, idx) => (
                <div key={idx} className="my-3">
                  <div className="font-bold">
                    {message.role === "user" ? "You" : "Astra"}
                  </div>
                  <div className="text-lg prose">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div>
          <div className="w-full max-w-screen-md mx-auto flex px-4 pb-4">
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="border text-lg rounded-md p-1 flex-1 "
              rows={1}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendRequest}
              className="border rounded-md bg-blue-500 hover:bg-blue-600 text-white px-4 ml-2"
            >
              Send
            </button>
          </div>
        </div>

        {/* Test Button
      <div className="p-4">
        <button
          onClick={sendRequest}
          className="w-40 bordered rounded bg-blue-500 hover:bg-blue-600 text-white p-2"
        >
          Send Request
        </button>
        <div className="mt-4 text-lg">{botMessage}</div>
      </div> */}
      </div>
    </>
  );
}
