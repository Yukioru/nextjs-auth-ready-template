import kebabCase from 'lodash/kebabCase';

import reject from '@/lib/reject';
import getBody from '@/lib/getBody';
import withSession from '@/lib/withSession';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';


async function register(req, res) {
  if (req.method !== 'POST') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  let data;
  try {
    data = getBody(req, ['email', 'password', 'name']);
  } catch (error) {
    return reject(res, error.message, error.opts);
  }

  await dbConnect();

  const existUser = await User.findOne({ email: data.email });
  if (existUser) {
    return reject(res, 'exists', { entity: 'user' });
  }

  let user = {
    ...data,
    username: kebabCase(data.name),
  };
  let session;
  try {
    user = await User.create(user);

    req.session.user = {
      _id: String(user._id),
    };

    const token = await req.session.save();
    session = await Session.create({ token, userId: user._id });
  } catch (error) {
    return reject(res, 'internal', { error });
  }

  res.status(200).send({
    code: 200,
    data: {
      session,
    },
  });
}

export default withSession(register);
