import { DepthEstimationPipeline, RawImage, env, pipeline } from '@xenova/transformers';

import { StatusEvent, useAppStore } from './store.ts';

env.allowLocalModels = true;
// fixme temp fix need better solution
const BASE_URL = 'http://192.168.1.83:8000/depth-image-react-three-fiber/public/models/';
env.localModelPath = BASE_URL;
// env.localModelPath = './depth-image-react-three-fiber/models';

const DEPTH_ESTIMATION = 'depth-estimation' as const;
class DepthPredictPipeline {
  static model = 'Xenova/dpt-hybrid-midas';
  static instance: DepthEstimationPipeline | null = null;

  static async getInstance(progress_callback: CallableFunction) {
    this.instance ??= await pipeline<typeof DEPTH_ESTIMATION>(DEPTH_ESTIMATION, this.model, {
      progress_callback,
    });
    return this.instance;
  }
}

// const onMessageReceived = (e) => {
//   switch (e.data.status) {
//     case 'initiate':
//       // Model file start load: add a new progress item to the list.
//       setReady(false);
//       setProgressItems((prev) => [...prev, e.data]);
//       break;
//
//     case 'progress':
//       // Model file progress: update one of the progress items.
//       setProgressItems((prev) =>
//         prev.map((item) => {
//           if (item.file === e.data.file) {
//             return { ...item, progress: e.data.progress };
//           }
//           return item;
//         })
//       );
//       break;
//
//     case 'done':
//       // Model file loaded: remove the progress item from the list.
//       setProgressItems((prev) => prev.filter((item) => item.file !== e.data.file));
//       break;
//
//     case 'ready':
//       // Pipeline ready: the worker is ready to accept messages.
//       setReady(true);
//       break;
//
//     case 'update':
//       // Generation update: update the output text.
//       setOutput((o) => o + e.data.output);
//       break;
//
//     case 'complete':
//       // Generation complete: re-enable the "Translate" button
//       setDisabled(false);
//       break;
//   }
// };

export async function run(file: File) {
  let ready = false;
  function progressHook(event: StatusEvent) {
    switch (event.status) {
      case 'initiate':
        // Model file start load: add a new progress item to the list.
        ready = false;
        break;
      case 'progress':
        // Model file progress: update one of the progress items.
        useAppStore.getState().setStatus(event);
        break;
      case 'ready':
        // Pipeline ready: the worker is ready to accept messages.
        ready = true;
        break;
      case 'done':
        // Model file loaded: remove the progress item from the list.
        break;
      default:
        console.log('doooo', event);
    }
  }

  console.log({ ready });
  const predictor = await DepthPredictPipeline.getInstance(progressHook);
  const image = await RawImage.fromBlob(file);
  const prediction = await predictor(image);
  console.log({ ready });
  if (Array.isArray(prediction)) {
    throw new Error('not supported');
  }
  console.log(prediction);
  const depth = prediction.depth;
  const colorBlob = await image.toBlob();
  const depthBlob = await depth.toBlob();
  const colorImage = URL.createObjectURL(colorBlob);

  const depthImage = URL.createObjectURL(depthBlob);
  return { colorImage, depthImage };
}
