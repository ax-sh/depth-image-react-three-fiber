import { RawImage } from '@xenova/transformers';
import { useLayoutEffect, useRef, useState } from 'react';

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
//
export function useDepthProcessingWorker() {
  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);
  //   const [ready, setReady] = useState(null);
  //   const [disabled, setDisabled] = useState(false);
  //   const [progressItems, setProgressItems] = useState([]);
  //
  //   // Inputs and outputs
  //   const [input, setInput] = useState('I love walking my dog.');
  //   const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  //   const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  //   const [output, setOutput] = useState('');
  //
  //   // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useLayoutEffect(() => {
    // Create the worker if it does not yet exist.
    worker.current ??= new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
    });

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: unknown) => {
      //       switch (e.data.status) {
      //         case 'initiate':
      //           // Model file start load: add a new progress item to the list.
      //           // setReady(false);
      //           // setProgressItems(prev => [...prev, e.data]);
      //           break;
      //
      //         case 'progress':
      //           // Model file progress: update one of the progress items.
      //           setProgressItems((prev) =>
      //             prev.map((item) => {
      //               if (item.file === e.data.file) {
      //                 return { ...item, progress: e.data.progress };
      //               }
      //               return item;
      //             })
      //           );
      //           break;
      //
      //         case 'done':
      //           // Model file loaded: remove the progress item from the list.
      //           setProgressItems((prev) => prev.filter((item) => item.file !== e.data.file));
      //           break;
      //
      //         case 'ready':
      //           // Pipeline ready: the worker is ready to accept messages.
      //           setReady(true);
      //           break;
      //
      //         case 'update':
      //           // Generation update: update the output text.
      //           setOutput((o) => o + e.data.output);
      //           break;
      //
      //         case 'complete':
      //           // Generation complete: re-enable the "Translate" button
      //           setDisabled(false);
      //           break;
      //       }
    };
    //
    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);
    //
    //     // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  });
  //   // console.log(worker.current., 3333);
}
