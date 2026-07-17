export interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

/**
 * Options for the openFile function.
 */
export interface OpenFileOptions {
  /**
   * Array of allowed file types.
   * Example: [{ description: 'Text Files', accept: { 'text/plain': ['.txt'] } }]
   */
  types?: FilePickerAcceptType[];
  /**
   * Whether to allow selecting multiple files. Defaults to false.
   * If true, openFile will return an array of File objects or strings.
   */
  multiple?: boolean;
  /**
   * Whether to exclude default accept types. Defaults to false.
   */
  excludeAcceptAllOption?: boolean;
  /**
   * The expected return type. If 'text', returns a string. If 'file', returns a File object. Defaults to 'file'.
   */
  returnType?: 'text' | 'file';
}

// Global interfaces since they might not be available in standard lib.dom.d.ts yet depending on version
declare global {
  interface Window {
    showOpenFilePicker(options?: any): Promise<any[]>;
    showSaveFilePicker(options?: any): Promise<any>;
  }
}

/**
 * Opens a file picker dialog and reads the selected file(s).
 */
export async function openFile(options?: OpenFileOptions & { multiple: true, returnType: 'text' }): Promise<string[]>;
export async function openFile(options?: OpenFileOptions & { multiple: true, returnType?: 'file' }): Promise<File[]>;
export async function openFile(options?: OpenFileOptions & { multiple?: false, returnType: 'text' }): Promise<string>;
export async function openFile(options?: OpenFileOptions & { multiple?: false, returnType?: 'file' }): Promise<File>;
export async function openFile(options: OpenFileOptions = {}): Promise<File | string | (File | string)[]> {
  if (!('showOpenFilePicker' in window)) {
    throw new Error('File System Access API is not supported in this browser.');
  }

  const { multiple = false, returnType = 'file', ...pickerOptions } = options;

  try {
    const fileHandles = await window.showOpenFilePicker({
      multiple,
      ...pickerOptions,
    });

    const readHandle = async (handle: any) => {
      const file = await handle.getFile();
      if (returnType === 'text') {
        return await file.text();
      }
      return file;
    };

    if (multiple) {
      return await Promise.all(fileHandles.map(readHandle));
    }

    return await readHandle(fileHandles[0]);
  } catch (err: any) {
    throw err;
  }
}

/**
 * Options for the saveFile function.
 */
export interface SaveFileOptions {
  /**
   * The suggested name for the file.
   */
  suggestedName?: string;
  /**
   * Array of allowed file types.
   */
  types?: FilePickerAcceptType[];
  /**
   * Whether to exclude default accept types. Defaults to false.
   */
  excludeAcceptAllOption?: boolean;
}

/**
 * Opens a file save dialog and writes the content to the selected file.
 * @param content The content to save. Can be a string, Blob, or BufferSource.
 * @param options Options for the save dialog.
 */
export async function saveFile(content: string | Blob | BufferSource, options: SaveFileOptions = {}): Promise<void> {
  if (!('showSaveFilePicker' in window)) {
    throw new Error('File System Access API is not supported in this browser.');
  }

  try {
    const fileHandle = await window.showSaveFilePicker(options);
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  } catch (err: any) {
    throw err;
  }
}
