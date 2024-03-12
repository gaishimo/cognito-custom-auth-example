import { CreateAuthChallengeTriggerEvent } from "aws-lambda";

/*
 * カスタム認証チャレンジを作成
 */
export const handler = async (event: CreateAuthChallengeTriggerEvent) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  event.response.privateChallengeParameters = {};

  event.response.publicChallengeParameters = {
    message: "Send id token as a challenge response",
  };
  console.log("response:", event.response);
  return event;
};
