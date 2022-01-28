import reject from '@/lib/reject';
import withSession from '@/lib/withSession';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

async function user(req, res) {
  if (req.method !== 'GET') {
    return reject(res, 'not-allowed', { method: req.method });
  }

  await dbConnect();

  const sessionUser = req.session.user || {};

  let user = null;
  try {
    if (sessionUser._id) {
      user = await User.findById(sessionUser._id);
    }
  } catch (error) {
    return reject(res, 'internal', { error });
  }

  res.status(200).send({
    code: 200,
    data: {
      user,
    },
  });
}

export default withSession(user);
