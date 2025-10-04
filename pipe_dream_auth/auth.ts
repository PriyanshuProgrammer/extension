import { PipedreamClient } from "@pipedream/sdk";

const client = new PipedreamClient({
  projectEnvironment: "production",
  clientId: process.env.PIPEDREAM_CLIENT_ID,
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
  projectId: process.env.PIPEDREAM_PROJECT_ID,
});

export const getConnectUrl = async (userId: string, app: string) => {
  const { connectLinkUrl } = await client.tokens.create({
    externalUserId: userId,
  });
  return connectLinkUrl + `&app=${app}`;
};
