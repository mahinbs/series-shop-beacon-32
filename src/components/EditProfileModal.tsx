
import React, { useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const EditProfileModal = (props: any) => {
  const { profile, updateProfile } = useSupabaseAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setAvatarUrl(profile?.avatar_url ?? '');
  }, [profile, props?.open]);

  const handleSave = async () => {
    // Use correct column names for updates
    await updateProfile({
      full_name: fullName,
      avatar_url: avatarUrl,
    });
    // Close using whichever prop is available from the caller
    if (props?.onOpenChange) props.onOpenChange(false);
    if (props?.onClose) props.onClose();
  };

  return (
    <div className={props?.open ? 'block' : 'hidden'}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-background text-foreground w-full max-w-md rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Edit profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Full name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-background"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Avatar URL</label>
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-background"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button
              className="px-4 py-2 text-sm rounded border"
              onClick={() => {
                if (props?.onOpenChange) props.onOpenChange(false);
                if (props?.onClose) props.onClose();
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm rounded bg-primary text-primary-foreground"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
