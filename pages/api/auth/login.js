import dbConnect from '@/lib/dbConnect';
import reject from '@/lib/reject';
import withSession from '@/lib/withSession';
import getBody from '@/lib/getBody';
import Session from '@/models/Session';
import User from '@/models/User';

async function login(req, res) {
  if (req.method !== 'POST') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  let data;
  try {
    data = getBody(req, ['email', 'password']);
  } catch (error) {
    return reject(res, error.message, error.opts);
  }

  await dbConnect();

  let user;
  try {
    user = await User.findOne({ email: data.email });
    if (!user) throw {
      message: 'not-found',
      opts: {
        entity: 'user',
      },
    };
  } catch (error) {
    const type = error.opts ? error.message : 'internal';
    const opts = error.opts ? error.opts : { error };
    return reject(res, type, opts);
  }

  let isPasswordCorrect = false;
  try {
    isPasswordCorrect = await user.comparePassword(data.password);
  } catch (error) {
    return reject(res, error.message, error.opts);
  }

  if (!isPasswordCorrect) {
    return reject(res, 'password-incorrect');
  }

  req.session.user = {
    _id: String(user._id),
  };
  let session;
  try {
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

export default withSession(login);
