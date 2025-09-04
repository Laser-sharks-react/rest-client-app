'use client';

import { auth, logout, registerWithEmailAndPassword } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      await registerWithEmailAndPassword(name, email, password);
      setSuccess(true);
    } catch (err: unknown) {
      console.error(err);
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) {
      setSuccess(true);
    }
    if (error) setSuccess(false);
  }, [user, loading, error]);

  return (
    <div className="flex flex-col gap-y-4 items-center justify-center min-h-screen bg-gray-100">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Full Name"
        className="text-black"
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="E-mail Address"
        className="text-black"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        className="text-black"
      />
      <button
        className="px-6 py-3 text-black rounded-lg shadow-md bg-grey"
        onClick={handleRegister}
      >
        Register
      </button>
      {success && (
        <p className="text-green-600 font-medium">
          ✅ User successfully registered!
        </p>
      )}
      {error && (
        <p className="text-red-600 font-medium">
          ❌ {error.message || 'An error occurred'}
        </p>
      )}
    </div>
  );
}
