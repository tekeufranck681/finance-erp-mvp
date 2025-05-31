import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

// TODO: create a theme store or context to persist theme preferences

const Settings = () => {
  const { user, updateUserInfo, updatePassword, clearError, error } = useAuthStore();
  const [theme, setTheme] = useState('light');

  // Profile Form
  const {
    register: registerInfo,
    handleSubmit: handleInfoSubmit,
    reset: resetInfo,
    formState: { errors: infoErrors, isSubmitting: isUpdatingInfo }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      organization: user?.organization || '',
      phone: user?.phone || ''
    }
  });

  // Password Form
  const {
    register: registerPass,
    handleSubmit: handlePassSubmit,
    reset: resetPass,
    formState: { errors: passErrors, isSubmitting: isUpdatingPass }
  } = useForm();

  useEffect(() => {
    clearError();
    if (user) {
      resetInfo({
        name: user.name,
        email: user.email,
        organization: user.organization,
        phone: user.phone
      });
    }
  }, [user, clearError, resetInfo]);

  const onInfoSubmit = async data => {
    try {
      // Require current password for security
      const currentPassword = data.currentPassword;
      const payload = {
        name: data.name,
        email: data.email,
        organization: data.organization,
        phone: data.phone,
        currentPassword
      };
      // TODO: call updateUserInfo(payload)
      await updateUserInfo(payload);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const onPassSubmit = async data => {
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      };
      // TODO: call updatePassword(payload)
      await updatePassword(payload);
      toast.success('Password changed successfully');
      resetPass();
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-3xl mx-auto space-y-8"
    >
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Theme Toggle */}
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="settings-page p-6">
      {/* Use your existing ToggleDarkMode button here */}
      dark mode 
    </div>
      </section>

      {/* Profile Update */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Name</label>
            <input
              {...registerInfo('name', { required: 'Name required' })}
              className="form-input w-full"
            />
            {infoErrors.name && <p className="form-error">{infoErrors.name.message}</p>}
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              {...registerInfo('email', { required: 'Email required' })}
              className="form-input w-full"
            />
            {infoErrors.email && <p className="form-error">{infoErrors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Organization</label>
            <input
              {...registerInfo('organization', { required: 'Organization required' })}
              className="form-input w-full"
            />
            {infoErrors.organization && <p className="form-error">{infoErrors.organization.message}</p>}
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              {...registerInfo('phone')}
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              {...registerInfo('currentPassword', { required: 'Current password required' })}
              className="form-input w-full"
            />
            {infoErrors.currentPassword && <p className="form-error">{infoErrors.currentPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isUpdatingInfo}
            className="btn btn-primary"
          >
            {isUpdatingInfo ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </section>

      {/* Password Change */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePassSubmit(onPassSubmit)} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              {...registerPass('currentPassword', { required: 'Current password required' })}
              className="form-input w-full"
            />
            {passErrors.currentPassword && <p className="form-error">{passErrors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="form-label">New Password</label>
            <input
              type="password"
              {...registerPass('newPassword', { required: 'New password required', minLength: { value: 6, message: 'At least 6 chars' } })}
              className="form-input w-full"
            />
            {passErrors.newPassword && <p className="form-error">{passErrors.newPassword.message}</p>}
          </div>

          <div>
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              {...registerPass('confirmPassword', {
                required: 'Confirm password required',
                validate: value => value === registerPass('newPassword').value || 'Passwords must match'
              })}
              className="form-input w-full"
            />
            {passErrors.confirmPassword && <p className="form-error">{passErrors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isUpdatingPass}
            className="btn btn-primary"
          >
            {isUpdatingPass ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </section>
    </motion.div>
  );
};

export default Settings;
