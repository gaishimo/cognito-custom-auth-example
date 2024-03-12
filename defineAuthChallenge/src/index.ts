import { DefineAuthChallengeTriggerEvent } from "aws-lambda";

/*
 * カスタム認証のステップを定義する
 */
export const handler = async (event: DefineAuthChallengeTriggerEvent) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const session = event.request.session;

  if (session.length === 0) {
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
    console.log("set response (0):", event.response);
    return event;
  }

  if (session.length === 1) {
    const prevSession = session[0];
    if (
      prevSession.challengeName === "CUSTOM_CHALLENGE" &&
      prevSession.challengeResult
    ) {
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
      console.log("set response (1):", event.response);
      return event;
    }
  }

  event.response.issueTokens = false;
  event.response.failAuthentication = true;
  return event;
};
