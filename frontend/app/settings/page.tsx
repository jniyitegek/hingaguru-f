"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import Nav from '@/components/common/Nav';
import { useLocale } from '@/context/LocaleContext';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      }));
    }
  }, [user]);

const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber
      });
      const msg = res?.message ?? 'Profile updated successfully';
      toast.success(msg);
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
  const res = await updateProfile({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
  const msg = res?.message ?? 'Password changed successfully';
  toast.success(msg);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <Toaster position={`top-center`} />
      <div className="p-8">
  <h1 className="text-2xl font-bold text-gray-800 mb-8">{t("settings.title")}</h1>
        
        <div className="max-w-2xl space-y-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("settings.profileTitle")}</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    variant="text"
                    value={formData.name}
                    onChange={(value) => handleChange("name", value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    variant="text"
                    value={formData.email}
                    onChange={(value) => handleChange("email", value)}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  variant="text"
                  value={formData.phoneNumber}
                  onChange={(value) => handleChange("phoneNumber", value)}
                />
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t("buttons.saving") : t("buttons.save")}
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("settings.changePasswordTitle")}</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  variant="password"
                  value={formData.currentPassword}
                  onChange={(value) => handleChange("currentPassword", value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    variant="password"
                    value={formData.newPassword}
                    onChange={(value) => handleChange("newPassword", value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    variant="password"
                    value={formData.confirmPassword}
                    onChange={(value) => handleChange("confirmPassword", value)}
                    required
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button type="submit" variant="outline" disabled={isLoading}>
                  {isLoading ? t("buttons.saving") : t("buttons.updatePassword")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
