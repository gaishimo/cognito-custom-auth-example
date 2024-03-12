import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
const bcrypt = require("bcrypt");

const CONFIG_VALUES = {
  awsRegion: "ap-northeast-1",
  userPoolId: "xxxxxxxxxxxxxx",
  cognitoClientId: "xxxxxxxxxxxxxx",
  passwordSalt: "xxxxxxxxxxxxxx",
};

const AUTH_DATA = {
  line: {
    id: "xxxxxxxxxxxxxx",
    token: "xxxxxxxxxxxxxx",
  },
  apple: {
    id: "xxxxxxxxxxxxxx",
    token: "xxxxxxxxxxxxxx",
  },
};

const cognitoClient = new CognitoIdentityProviderClient({
  region: CONFIG_VALUES.awsRegion,
});

const main = async () => {
  const authMethod = "line";
  // const authMethod = "apple";

  const { id, token } = AUTH_DATA[authMethod];

  const userName = getUserName(authMethod, id);

  const userExists = await checkUserExistence(userName);
  if (!userExists) {
    console.log("user doesn't exists");
    await signUpUser(userName, authMethod);
  }

  const password = hashPassword(userName);
  console.log("password", password);
  const command1 = new InitiateAuthCommand({
    AuthFlow: "CUSTOM_AUTH",
    ClientId: CONFIG_VALUES.cognitoClientId,
    AuthParameters: {
      USERNAME: userName,
      PASSWORD: password,
    },
  });

  const response1 = await cognitoClient.send(command1);
  console.log("InitiateAuth result: ", response1);

  if (response1.ChallengeName === "CUSTOM_CHALLENGE") {
    console.log("respond to auth challenge");
    const command2 = new RespondToAuthChallengeCommand({
      ChallengeName: "CUSTOM_CHALLENGE",
      ClientId: CONFIG_VALUES.cognitoClientId,
      ChallengeResponses: {
        USERNAME: userName,
        ANSWER: token,
      },
      Session: response1.Session,
    });
    try {
      const response2 = await cognitoClient.send(command2);
      console.log("RespondToAuthChallengeCommand result:", response2);
    } catch (e) {
      console.log("failed", e.message);
    }
  }
};

async function signUpUser(userName: string, authMethod: "apple" | "line") {
  const password = hashPassword(userName);
  console.log("sign up. password:", password);

  const customAttributes = {
    apple: "custom:isApple",
    line: "custom:isLine",
  };

  const command = new SignUpCommand({
    ClientId: CONFIG_VALUES.cognitoClientId,
    Username: userName,
    Password: password,
    UserAttributes: [
      {
        Name: customAttributes[authMethod],
        Value: "true",
      },
    ],
  });

  const response = await cognitoClient.send(command);
  console.log("sign-up response", response);
}

async function checkUserExistence(userName: string) {
  const getUserCommand = new AdminGetUserCommand({
    Username: userName,
    UserPoolId: CONFIG_VALUES.userPoolId,
  });
  try {
    await cognitoClient.send(getUserCommand);
    return true;
  } catch (e) {
    return false;
  }
}

function getUserName(authMethod: "apple" | "line", id: string) {
  return `${authMethod}:${id}`;
}

function hashPassword(source: string): string {
  // 生成文字列は常に60文字になる
  const hashedPassword = bcrypt.hashSync(source, CONFIG_VALUES.passwordSalt);
  return hashedPassword;
}

main();
