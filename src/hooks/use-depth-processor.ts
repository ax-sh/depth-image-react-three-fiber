import { RawImage } from '@xenova/transformers';
import { useLayoutEffect, useState } from 'react';

import { getPredictor } from './depth-estimation-predictor.ts';

type ImagePaths = {
  colorImage: string;
  depthImage: string;
};

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

export function useDepthProcessor(files: File[]) {
  const [state, setState] = useState<ImagePaths>({} as ImagePaths);
  // const worker = useDepthWorker();

  useLayoutEffect(() => {
    const [file] = files;
    if (!file) return;

    const instance = new ComlinkWorker<typeof import('../worker')>(
      new URL('../worker', import.meta.url),
      {
        name: 'calculationsComLink',
        type: 'module',
        /* normal Worker options*/
      }
    );
    const result = instance.run(makeDepthMap, file);
    result.then((x) => console.log(x));

    // async function run() {
    //   const { colorImage, depthImage } = await makeDepthMap(file, (event: StatusEvent) =>
    //     // setStatus(event)
    //     useAppStore.getState().setStatus(event)
    //   );
    //
    //   setState({ colorImage, depthImage });
    // }
    // void run();
  }, [files]);
  return { state };
}
