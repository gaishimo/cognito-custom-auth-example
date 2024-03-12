import axios from "axios";
import { stringify } from "querystring";

const LINE_CHANNEL_ID = "xxxxxxxxxxxxxx";

const idToken = "xxxxxxxxxxxxxx";

async function main() {
  const result = await verifyIdToken(idToken);
  console.log("LINE idToken verification:", result);
}

main();

async function verifyIdToken(idToken: string) {
  const url = "https://api.line.me/oauth2/v2.1/verify";
  try {
    const response = await axios.post(
      url,
      stringify({
        id_token: idToken,
        client_id: LINE_CHANNEL_ID,
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
