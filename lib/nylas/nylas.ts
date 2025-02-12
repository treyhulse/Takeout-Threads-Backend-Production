import "dotenv/config";
import Nylas from "nylas";

const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri: "http://localhost:3000/oauth/exchange",
  apiKey: process.env.NYLAS_API_KEY,
  apiUri: process.env.NYLAS_API_URI,
};

const nylas = new Nylas({
  apiKey: nylasConfig.apiKey as string,
  apiUri: nylasConfig.apiUri as string,
});

export default nylas;   