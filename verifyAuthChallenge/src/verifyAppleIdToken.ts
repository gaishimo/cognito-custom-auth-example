import { decode as decodeJwt, verify as verifyJwt } from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";

/**
 * Appleサインインのid tokenの検証を行う
 * Appleの公開鍵を取得しidTokenの署名を検証
 */
export async function verifyAppleIdToken(
  idToken: string,
  appId: string,
): Promise<boolean> {
  try {
    const decoded = decodeJwt(idToken, { complete: true });
    if (decoded == null) throw new Error("Token is not a JWT.");
    console.log("decoded:", decoded);

    const kid = decoded.header.kid;
    console.log("kid:", kid);
    const key = await getAppleSigningKey(kid);
    console.log("apple signing key:", key);

    const result = verifyJwt(idToken, key, {
      audience: appId,
      issuer: "https://appleid.apple.com",
      algorithms: ["RS256"],
    });
    console.log("Token verified successfully. result:", result);
    return true;
  } catch (err) {
    console.log("Token verification failed:", err);
    return false;
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
