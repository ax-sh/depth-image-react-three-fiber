import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { useAppStore } from './store.ts';

export function useImageFileDropZone() {
  // Get the action to add files from the Zustand store.
  // This selector will NOT cause re-renders if the 'files' state changes,
  // because the 'addFiles' function reference itself is stable.
  const addFiles = useAppStore((state) => state.addFiles);

  // Get the files state from the Zustand store.
  // This selector WILL cause re-renders in components using this hook
  // whenever the 'files' array in the store is updated (e.g., by addFiles).
  const files = useAppStore((state) => state.files);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      addFiles(acceptedFiles); // Use the Zustand action to update files
    },
    [addFiles] // `addFiles` is stable, so this useCallback dependency array is fine
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });
  return {
    getRootProps,
    getInputProps,
    isDragActive,
    files,
  };
}
