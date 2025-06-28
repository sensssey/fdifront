import { useState, useEffect } from 'react';
import { apiClient } from '../../services/api';

const AvatarManager = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvatar = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/users/avatar', {
        responseType: 'blob',
      });

      if (response.data.size === 0) {
        throw new Error('Server returned empty avatar');
      }
      const url = URL.createObjectURL(response.data);
      setAvatarUrl(url);
      setError(null);
    } catch (err) {
      setError('Failed to load avatar');
      setAvatarUrl(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAvatar();
    return () => {
      if (avatarUrl) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, []);
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await apiClient.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await loadAvatar();
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="status">Loading...</div>;
  if (error) return <div className="status error">{error}</div>;
  return (
    <div className="avatar-container">
      {avatarUrl ? (
        <>
          <img 
            src={avatarUrl} 
            alt="User avatar"
            onError={() => setError('Failed to display avatar')}
          />
          <div>
            <label>
              Change Avatar
              <input 
                type="file" 
                accept="image/jpeg,image/png" 
                onChange={handleUpload}
                hidden
              />
            </label>
          </div>
        </>
      ) : (
        <label>
          Upload Avatar
          <input 
            type="file" 
            accept="image/jpeg,image/png" 
            onChange={handleUpload}
            hidden
          />
        </label>
      )}
    </div>
  );
};

export default AvatarManager;