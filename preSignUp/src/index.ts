import { PreSignUpTriggerEvent } from "aws-lambda";

/**
 * Pre Sign-up
 * 外部ログインの場合、強制的にユーザーを確認済にする
 * 確認済でないとログインできない
 */
export const handler = async (event: PreSignUpTriggerEvent) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const isLine = event.request.userAttributes["custom:isLine"] === "true";
  const isApple = event.request.userAttributes["custom:isApple"] === "true";
  if (isLine || isApple) {
    event.response.autoConfirmUser = true;
  }
  return event;
};
