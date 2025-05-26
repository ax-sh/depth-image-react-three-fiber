import { RawImage } from "@xenova/transformers";
import { useLayoutEffect, useState } from "react";

import { getPredictor } from "./depth-estimation-predictor.ts";
import { StatusEvent, useAppStore } from "./store.ts";
import useWebWorker from "./use-web-worker.ts";

async function makeDepthMap(file: File, progress_callback: CallableFunction) {
  const color = await RawImage.fromBlob(file);
  const predictor = await getPredictor({
    progress_callback,
    // local_files_only: true,
  });

  const prediction = await predictor(color);
  if (Array.isArray(prediction)) {
    throw new Error("not supported");
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
    colorImage: "",
    depthImage: "",
  });

  const setStatus = useAppStore((state) => state.setStatus);
  const { run, loading } = useWebWorker(makeDepthMap);
  console.log(loading, "333");

  useLayoutEffect(() => {
    const [file] = files;
    if (!file) return;
    const a = run(file);
    // console.log(a, 'ddddd');
    async function Moo() {
      makeDepthMap(file, (event: StatusEvent) => setStatus(event)).then(
        ({ colorImage, depthImage }) => {
          setState({ colorImage, depthImage });
        },
      );
    }
    Moo();
  }, [files, setStatus, run]);
  return { state };
}
