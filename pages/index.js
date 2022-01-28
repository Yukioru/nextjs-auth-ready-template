import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home({ user }) {
  const router = useRouter();
  async function login(params) {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": "test@example.com",
        "password": "loremipsum"
      }),
    }).then(res => res.json());
    if (res.code === 200) {
      router.reload();
    }
  }

  async function logout(params) {
    const res = await fetch('http://localhost:3000/api/auth/logout').then(res => res.json());
    if (res.code === 200) {
      router.reload();
    }
  }

  return (
      <div>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
        <Link href="/settings">Go to settings</Link>

        <div>
          <b>{user?._id}</b>
          <h1>{user?.name}</h1>
          <p>{user?.username}</p>
          {user?.avatar && (
            <Image alt={user?.name} src={user?.avatar} width={100} height={100} />
          )}
        </div>
      </div>
  )
}
