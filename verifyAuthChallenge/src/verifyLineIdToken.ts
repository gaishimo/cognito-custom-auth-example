import axios from "axios";
import { stringify } from "querystring";

/**
 * LINEのIDトークンを検証する
 * 指定のURLに送信し検証する
 */
export async function verifyLineIdToken(
  idToken: string,
  channelId: string,
): Promise<boolean> {
  const url = "https://api.line.me/oauth2/v2.1/verify";
  try {
    const response = await axios.post(
      url,
      stringify({
        id_token: idToken,
        client_id: channelId,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    return response.status === 200;
  } catch (error) {
    console.log(error);
  }
  return false;
}
