import type { FreshContext, Handlers } from "$fresh/server.ts";
import type { ClientConfig, TextEventMessage } from "npm:@line/bot-sdk@9.2.2";
import { MessageEvent, messagingApi } from "npm:@line/bot-sdk@9.2.2";

declare interface DifyCompletionMessageResponse {
  event: string;
  task_id: string;
  id: string;
  message_id: string;
  mode: string;
  answer: string;
  metadata: {
    usage: {
      prompt_tokens: number;
      prompt_unit_price: string;
      prompt_price_unit: string;
      prompt_price: string;
      completion_tokens: number;
      completion_unit_price: string;
      completion_price_unit: string;
      completion_price: string;
      total_tokens: number;
      total_price: string;
      currency: string;
      latency: number;
    };
  };
  created_at: number;
}

// 環境変数の取得
const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
const LINE_CHANNEL_SECRET = Deno.env.get("LINE_CHANNEL_SECRET");
const DIFY_API_KEY = Deno.env.get("DIFY_API_KEY");

// 環境変数の存在確認
if (!LINE_CHANNEL_ACCESS_TOKEN) {
  throw new Error("LINE_CHANNEL_ACCESS_TOKEN is required");
}
if (!LINE_CHANNEL_SECRET) {
  throw new Error("LINE_CHANNEL_SECRET is required");
}
if (!DIFY_API_KEY) {
  throw new Error("DIFY_API_KEY is required");
}

const config: ClientConfig = {
  channelAccessToken: LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: LINE_CHANNEL_SECRET,
};
const client = new messagingApi.MessagingApiClient(config);

export const handler: Handlers = {
  async POST(_req: Request, _ctx: FreshContext): Promise<Response> {
    const body = await _req.json();
    const event: MessageEvent = body.events[0];
    const textMessage = event.message as TextEventMessage;
    console.log(textMessage.text);
    // request to Dify API
    const requestData = {
      inputs: {
        query: textMessage.text,
      },
      response_mode: "blocking",
      user: "line-bot",
    };
    const resp = await fetch("https://api.dify.ai/v1/completion-messages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const res = await resp.json() as DifyCompletionMessageResponse;
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: res.answer,
        },
      ],
    });
    return new Response(null, { status: 204 });
  },
};
