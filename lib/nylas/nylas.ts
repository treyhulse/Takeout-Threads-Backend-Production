import Nylas from "nylas";

if (!process.env.NYLAS_API_KEY || !process.env.NYLAS_GRANT_ID) {
  throw new Error('Missing required Nylas environment variables');
}

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY,
});

export default nylas;   