//
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

export function useDepthProcessingWorker() {
  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);
  const [ready, setReady] = useState(false);
  //   const [disabled, setDisabled] = useState(false);
  const [progressItems, setProgressItems] = useState<any[]>([]);
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
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress };
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) => prev.filter((item) => item.file !== e.data.file));
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        // case 'update':
        // Generation update: update the output text.
        // setOutput((o) => o + e.data.output);
        // break;

        // case 'complete':
        // Generation complete: re-enable the "Translate" button
        // setDisabled(false);
        // break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  });
  const processImage = useCallback(() => {
    worker.current?.postMessage({});
  }, []);
  return {
    worker,

    processImage,
  };
}
