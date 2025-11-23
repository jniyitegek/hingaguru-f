"use client"

import dynamic from 'next/dynamic';

// Dynamically import the RegisterForm component with SSR disabled
const RegisterForm = dynamic(
  () => import('@/components/auth/RegisterForm'),
  { ssr: false }
);

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
