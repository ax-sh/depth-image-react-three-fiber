import { RawImage } from '@xenova/transformers';
import { useEffect, useRef, useState } from 'react';

import { getPredictor } from './hooks/depth-estimation-predictor.ts';
import { StatusEvent } from './hooks/store.ts';

export const add = (a: number, b: number) => a + b;

export async function run(makeDepthMap: CallableFunction, file: File) {
  let ready = false;
  const { colorImage, depthImage } = await makeDepthMap(file, (event: StatusEvent) => {
    switch (event.status) {
      case 'initiate':
        // Model file start load: add a new progress item to the list.
        ready = false;
        // setProgressItems((prev) => [...prev, event.data]);
        break;
      case 'ready':
        // Pipeline ready: the worker is ready to accept messages.
        ready = true;
        break;
      default:
        console.log('foo', event);
    }
  });
  console.log(colorImage, depthImage);
  return 'doing';
}

// import { TextStreamer, pipeline } from "@xenova/transformers";
//
// class MyTranslationPipeline {
//   static task = "translation";
//   static model = "Xenova/nllb-200-distilled-600M";
//   static instance = null;
//
//   static async getInstance(progress_callback = null) {
//     this.instance ??= pipeline(this.task, this.model, { progress_callback });
//     return this.instance;
//   }
// }
//

// function useDepthWorker() {
//   // Create a reference to the worker object.
//   const worker = useRef<Worker | null>(null);
//
//   // Model loading
//   const [ready, setReady] = useState(false);
//   const [disabled, setDisabled] = useState(false);
//   const [progressItems, setProgressItems] = useState([]);
//
//   // Inputs and outputs
//   const [input, setInput] = useState('I love walking my dog.');
//   const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
//   const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
//   const [output, setOutput] = useState('');
//
//   // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
//   useEffect(() => {
//     // Create the worker if it does not yet exist.
//     worker.current ??= new Worker(new URL('./worker.js', import.meta.url), {
//       type: 'module',
//     });
//
//     // Create a callback function for messages from the worker thread.
//     const onMessageReceived = (e) => {
//       // TODO: Will fill in later
//       console.log('todo worker', e);
//     };
//
//     // Attach the callback function as an event listener.
//     worker.current.onmessage = onMessageReceived;
//
//     // Define a cleanup function for when the component is unmounted.
//     return () => worker.current?.removeEventListener('message', onMessageReceived);
//   });
//   const run = (file: File) => {
//     console.log(file, 33, 'todo');
//     setDisabled(true);
//     setOutput('');
//     worker.current?.postMessage({
//       text: input,
//       src_lang: sourceLanguage,
//       tgt_lang: targetLanguage,
//     });
//   };
//   return {
//     ready,
//     disabled,
//     progressItems,
//     input,
//     sourceLanguage,
//     targetLanguage,
//     output,
//     run,
//   };
// }
