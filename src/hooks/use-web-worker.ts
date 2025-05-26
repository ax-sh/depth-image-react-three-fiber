import { useCallback, useEffect, useRef, useState } from "react";

function useWebWorker(workerFunction: CallableFunction) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState<ErrorEvent>();
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (workerFunction) {
      const worker = new Worker(
        URL.createObjectURL(
          new Blob([`(${workerFunction.toString()})()`], {
            type: "text/javascript",
          }),
        ),
      );

      workerRef.current ??= worker;

      worker.onmessage = (event) => {
        setResult(event.data);
        setLoading(false);
      };

      worker.onerror = (error) => {
        setError(error);
        setLoading(false);
      };
    }
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerFunction]);

  const run = useCallback((data: unknown) => {
    setLoading(true);
    setError(undefined);
    console.log(333);
    workerRef.current?.postMessage(data);
  }, []);

  return { result, error, loading, run };
}
export default useWebWorker;
