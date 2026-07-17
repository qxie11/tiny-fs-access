import { ref } from 'vue';
import { openFile, saveFile, OpenFileOptions, SaveFileOptions } from './index';

export function useFileSystem() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const open = async (options?: OpenFileOptions) => {
    loading.value = true;
    error.value = null;
    try {
      const result = await openFile(options as any);
      return result;
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const save = async (content: string | Blob | BufferSource, options?: SaveFileOptions) => {
    loading.value = true;
    error.value = null;
    try {
      await saveFile(content, options);
    } catch (err: any) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { open: open as typeof openFile, save, loading, error };
}
