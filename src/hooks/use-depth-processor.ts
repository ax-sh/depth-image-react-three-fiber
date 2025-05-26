import { RawImage } from '@xenova/transformers';
import { useLayoutEffect, useRef, useState } from 'react';

import { getPredictor } from './depth-estimation-predictor.ts';

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

export function useDepthProcessor(files: File[]) {
  const [state, setState] = useState<{
    colorImage: string;
    depthImage: string;
  }>({
    colorImage: '',
    depthImage: '',
  });
  const eventRef = useRef<unknown>({});

  useLayoutEffect(() => {
    const [file] = files;
    if (!file) return;
    makeDepthMap(file, (event: unknown) => {
      eventRef.current = event;
    }).then(({ colorImage, depthImage }) => {
      setState({ colorImage, depthImage });
    });
  }, [files]);
  return { state, eventRef };
}
