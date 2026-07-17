import { useState, useCallback } from 'react';
import { openFile, saveFile, OpenFileOptions, SaveFileOptions } from './index';

export function useFileSystem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const open = useCallback(async (options?: OpenFileOptions) => {
    setLoading(true);
    setError(null);
    try {
      const result = await openFile(options as any);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []) as typeof openFile;

  const save = useCallback(async (content: string | Blob | BufferSource, options?: SaveFileOptions) => {
    setLoading(true);
    setError(null);
    try {
      await saveFile(content, options);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { open, save, loading, error };
}
