import { RawImage } from '@xenova/transformers';
import { useLayoutEffect, useState } from 'react';

import { getPredictor } from './depth-estimation-predictor.ts';
import { StatusEvent, useAppStore } from './store.ts';

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
  const colorBlob = await color.toBlob();
  const depthBlob = await depth.toBlob();
  const colorImage = URL.createObjectURL(colorBlob);

  const depthImage = URL.createObjectURL(depthBlob);
  return { colorImage, depthImage };
}

type ImagePaths = {
  colorImage: string;
  depthImage: string;
};

export function useDepthProcessor(files: File[]) {
  const [state, setState] = useState<ImagePaths>({} as ImagePaths);

  const setStatus = useAppStore((state) => state.setStatus);

  useLayoutEffect(() => {
    const [file] = files;
    if (!file) return;

    async function run() {
      const { colorImage, depthImage } = await makeDepthMap(file, (event: StatusEvent) =>
        setStatus(event)
      );
      setState({ colorImage, depthImage });
    }
    void run();
  }, [files, setStatus]);
  return { state };
}
