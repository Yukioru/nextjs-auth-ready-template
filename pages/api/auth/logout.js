import cookie from 'cookie';

import reject from '@/lib/reject';
import withSession from '@/lib/withSession';
import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;

if (!SESSION_COOKIE_NAME) {
  throw new Error(
    'Please define the SESSION_COOKIE_NAME environment variable inside .env.local'
  );
}

async function logout(req, res) {
  if (req.method !== 'GET') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  await dbConnect();

  const { user } = req.session;
  const token = cookie.parse(req.headers.cookie || '')[SESSION_COOKIE_NAME];

  try {
    if (user && token) {
      await Session.deleteOne({ userId: user._id, token });
      await req.session.destroy();
    }
  } catch (error) {
    return reject(res, 'internal', { error });
  }

  res.status(200).send({
    code: 200,
  });
}

export default withSession(logout);
