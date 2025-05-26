import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export function useImageFileDropZone() {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((storedFiles) => [...acceptedFiles, ...storedFiles]);
  }, []);
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
