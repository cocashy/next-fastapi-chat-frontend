import { z } from 'zod';

export const Message = z.object({
    messageId: z.string(),
    name: z.string(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Message = z.infer<typeof Message>;

export const MessageRes = z.object({
    message_id: z.string(),
    name: z.string(),
    content: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type MessageRes = z.infer<typeof MessageRes>;

export const messageFromRes = (res: MessageRes): Message => {
    return {
        messageId: res["message_id"],
        name: res["name"],
        content: res["content"],
        createdAt: new Date(res["created_at"]),
        updatedAt: new Date(res["updated_at"]),
    };
}

export const CreateMessageReq = z.object({
    name: z.string(),
    content: z.string(),
});

export type CreateMessageReq = z.infer<typeof CreateMessageReq>;
