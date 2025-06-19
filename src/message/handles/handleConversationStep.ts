import { MessageEvent } from '@line/bot-sdk';
import { ConversationStep, userSession } from '../types/message.interface';

export async function handleConversationStep(
  session: userSession,
  event: MessageEvent,
  message: string
): Promise<boolean> {

    switch (session.step) {
        case ConversationStep.Content: {
            session.content = message;
            session.step = ConversationStep.Done;

            // Here you might want to reply something to the user
            // For example:
            // await replyText(event.replyToken, 'ได้รับข้อมูลของคุณแล้วค่ะ ขอบคุณค่ะ!');
            // session.step = undefined;
            // return true;

            console.log("เสร็จแล้ว");
            session.step = undefined;
            return true;  // Indicate that the message was handled
        }

        default:
            return false; // Not handled
    }
}
