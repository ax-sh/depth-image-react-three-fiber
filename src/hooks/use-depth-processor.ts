import { RawImage } from '@xenova/transformers';
import { useLayoutEffect, useState } from 'react';

import { getPredictor } from './depth-estimation-predictor.ts';
import { useAppStore } from './store.ts';

async function makeDepthMap(file: File, progress_callback: CallableFunction) {
  const color = await RawImage.fromBlob(file);
  const predictor = await getPredictor({
    progress_callback,
    // local_files_only: true,
  });

  const prediction = await predictor(color);
  if (Array.isArray(prediction)) {
    throw new Error('not supported');
  }
  const depth = prediction.depth;
  const colorImage = URL.createObjectURL(await color.toBlob());
  const depthImage = URL.createObjectURL(await depth.toBlob());
  return { colorImage, depthImage };
}

type Status = 'initiate' | 'download' | 'progress' | 'done' | 'ready';

export function useDepthProcessor(files: File[]) {
  const [state, setState] = useState<{
    colorImage: string;
    depthImage: string;
  }>({
    colorImage: '',
    depthImage: '',
  });

  const setStatus = useAppStore((state) => state.setStatus);

  useLayoutEffect(() => {
    const [file] = files;
    if (!file) return;
    makeDepthMap(
      file,
      (event: { status: Status; total?: number; loaded?: number; progress?: number }) => {
        setStatus(event);
        switch (event.status) {
          case 'initiate':
            return console.log(event);
          case 'progress':
            return console.log(event.progress, event.total, event.loaded);
          default:
            console.log('Mever', event);
        }
      }
    ).then(({ colorImage, depthImage }) => {
      setState({ colorImage, depthImage });
    });
  }, [files, setStatus]);
  return { state };
}
