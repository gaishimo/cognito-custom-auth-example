/**
 * Pre Sign-Inトリガー
 */
export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const userAttrs = event.request.userAttributes;
  const isLine = userAttrs["custom:isLine"] === "true";
  const isApple = userAttrs["custom:isApple"] === "true";
  if (isLine || isApple) {
    event.response.autoConfirmUser = true;
  }
  return event;
};
