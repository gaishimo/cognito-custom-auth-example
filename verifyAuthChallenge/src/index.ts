import { VerifyAuthChallengeResponseTriggerEvent } from "aws-lambda";
import { verifyAppleIdToken } from "./verifyAppleIdToken";
import { verifyLineIdToken } from "./verifyLineIdToken";

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID ?? "";
const APPLE_APP_ID = process.env.APPLE_APP_ID ?? "";

/*
 * カスタム認証でチャレンジの検証を行う
 */
export const handler = async (
  event: VerifyAuthChallengeResponseTriggerEvent,
) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const idToken = event.request.challengeAnswer;

  const userAttrs = event.request.userAttributes;
  const isLine = userAttrs["custom:isLine"] === "true";
  const isApple = userAttrs["custom:isApple"] === "true";

  if (isLine) {
    const ok = await verifyLineIdToken(idToken, LINE_CHANNEL_ID);
    console.log("LINE idToken verification result:", ok);
    return { ...event, response: { answerCorrect: ok } };
  } else if (isApple) {
    const ok = await verifyAppleIdToken(idToken, APPLE_APP_ID);
    console.log("Apple idToken verification result:", ok);
    return { ...event, response: { answerCorrect: ok } };
  } else {
    return { ...event, response: { answerCorrect: false } };
  }
};
