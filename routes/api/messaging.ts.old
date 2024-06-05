import type { Handlers, FreshContext } from "$fresh/server.ts";
import { messagingApi, MessageEvent } from "npm:@line/bot-sdk@8.4.0";
import type { ClientConfig } from "npm:@line/bot-sdk@8.4.0";

const config: ClientConfig = {
    channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
    channelSecret: "YOUR_CHANNEL_SECRET",
};
const client = new messagingApi.MessagingApiClient(config);

export const handler: Handlers =  {
  async POST(_req: Request, _ctx: FreshContext): Promise<Response> {
    const body = await _req.json() 
    const event: MessageEvent = body.events[0]
    await client.replyMessage({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: "Hello, I'm Fresh.",
        },
      ],
    });
    return new Response(null, { status: 204 });
  }
};
