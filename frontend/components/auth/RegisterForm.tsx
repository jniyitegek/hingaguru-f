"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';
import Link from 'next/link';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phoneNumber
      );
      // Redirect is handled in the register function
    } catch (error: any) {
      console.log(error)
      setError(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p className="mt-2 text-gray-600">Join us today!</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Input
            id="name"
            variant="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange('name')}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Input
            id="email"
            variant="email"
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange('email')}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Input
            id="phoneNumber"
            variant="text"
            label="Phone Number (Optional)"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange('phoneNumber')}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Input
            id="password"
            variant="password"
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange('password')}
            required
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Input
            id="confirmPassword"
            variant="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
            className="w-full"
          />
        </div>
        
        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
