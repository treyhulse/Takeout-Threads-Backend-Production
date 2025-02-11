import EasyPost from '@easypost/api';

if (!process.env.EASYPOST_API_KEY) {
  throw new Error('Missing EASYPOST_API_KEY environment variable');
}

export const easypost = new EasyPost(process.env.EASYPOST_API_KEY);
