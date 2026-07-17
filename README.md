# tiny-fs-access

A modern, lightweight (~1KB), Promise-based TypeScript wrapper for the native File System Access API.

Reading and saving files in the browser is now easier than ever. No more messy hidden `<input type="file">` elements, no more dealing with `FileSystemHandle`, streams, or object URLs.

## Features
- 🚀 **Tiny**: Zero dependencies, minimal bundle size.
- 💙 **TypeScript**: Written in TS with full type support.
- 📦 **Simple**: Returns actual `File` objects or raw text strings.
- 🔄 **Modern**: Uses the new `window.showOpenFilePicker` and `window.showSaveFilePicker` APIs.

## Installation

```bash
npm install tiny-fs-access
```

## Usage

### Reading a File

```typescript
import { openFile } from 'tiny-fs-access';

// Read as a File object (default)
const file = await openFile({
  types: [{ description: 'Images', accept: { 'image/*': ['.png', '.jpg'] } }]
});
console.log(file.name, file.size);

// Read multiple files as raw text
const texts = await openFile({
  multiple: true,
  returnType: 'text',
  types: [{ description: 'Text files', accept: { 'text/plain': ['.txt'] } }]
});
console.log(texts[0]); // Output: "Hello World!"
```

### Saving a File

```typescript
import { saveFile } from 'tiny-fs-access';

// Save string content
await saveFile('This is my file content!', {
  suggestedName: 'my-document.txt',
  types: [{ description: 'Text files', accept: { 'text/plain': ['.txt'] } }]
});

// Save a Blob (e.g., from a canvas)
const blob = await canvas.convertToBlob();
await saveFile(blob, { suggestedName: 'image.png' });
```

### React Hook

We provide a built-in React hook for seamless integration, including loading and error states.

```tsx
import { useFileSystem } from 'tiny-fs-access/react';

function App() {
  const { open, save, loading, error } = useFileSystem();

  const handleOpen = async () => {
    const text = await open({ returnType: 'text' });
    console.log(text);
  };

  return (
    <div>
      <button onClick={handleOpen} disabled={loading}>
        {loading ? 'Reading...' : 'Open File'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

