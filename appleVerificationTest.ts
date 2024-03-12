import { decode as decodeJwt, verify as verifyJwt } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";

const token = "xxxxxxxxxxxxxx";

const APP_ID = "xxxxxxxxxxxxxx"; // アプリのバンドルID

async function main() {
  try {
    const decoded = decodeJwt(token, { complete: true });
    if (decoded == null) throw new Error("Token is not a JWT.");
    console.log("decoded:", decoded);

    const kid = decoded.header.kid;
    const key = await getAppleSigningKey(kid);
    console.log("apple signing key:", key);

    const result = verifyJwt(token, key, {
      audience: APP_ID,
      issuer: "https://appleid.apple.com",
      algorithms: ["RS256"],
    });
    console.log("Token verified successfully. result:", result);
  } catch (err) {
    console.log("Token verification failed:", err);
  }
}

async function getAppleSigningKey(kid: string): Promise<string> {
  const client = new JwksClient({
    jwksUri: "https://appleid.apple.com/auth/keys",
  });
  return new Promise((resolve, reject) => {
    client.getSigningKey(kid, function (err, key) {
      if (err) {
        reject(err);
      } else {
        const signingKey = key.getPublicKey();
        resolve(signingKey as string);
      }
    });
  });
}

main();
