import Link from 'next/link';
import withSession from '@/lib/withSession';
import isAuth from '@/lib/isAuth';

export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <Link href="/">Go to home</Link>
    </div>
  )
}

export const getServerSideProps = withSession(async (req) => {
  const isAuthUser = isAuth(req);

  if (!isAuthUser) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
