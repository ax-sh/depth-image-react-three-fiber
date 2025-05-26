import { useCallback, useLayoutEffect, useRef, useState } from "react";

// Type definitions for better type safety
interface ProgressItem {
  file: string;
  progress?: number;
  status: "initiate" | "progress" | "done";
}

interface WorkerMessage {
  data: {
    status: "initiate" | "progress" | "done" | "ready" | "update" | "complete";
    file?: string;
    progress?: number;
    output?: string;
  };
}

interface ProcessingRequest {
  input?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

interface UseDepthProcessingWorkerReturn {
  // State
  ready: boolean;
  disabled: boolean;
  progressItems: ProgressItem[];
  input: string;
  sourceLanguage: string;
  targetLanguage: string;
  output: string;

  // Actions
  processImage: () => void;
  setInput: (input: string) => void;
  setSourceLanguage: (language: string) => void;
  setTargetLanguage: (language: string) => void;

  // Cleanup
  cleanup: () => void;
}

export function useDepthProcessingWorker(): UseDepthProcessingWorkerReturn {
  // Worker reference
  const workerRef = useRef<Worker | null>(null);

  // State management
  const [ready, setReady] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([]);

  // Processing inputs and outputs
  const [input, setInput] = useState<string>("I love walking my dog.");
  const [sourceLanguage, setSourceLanguage] = useState<string>("eng_Latn");
  const [targetLanguage, setTargetLanguage] = useState<string>("fra_Latn");
  const [output, setOutput] = useState<string>("");

  // Message handler with proper typing
  const handleWorkerMessage = useCallback(
    (event: MessageEvent<WorkerMessage["data"]>) => {
      const { data } = event;

      switch (data.status) {
        case "initiate":
          if (!data.file) return;
          setReady(false);
          setProgressItems((prev) => [
            ...prev,
            { file: data.file!, status: "initiate" },
          ]);
          break;

        case "progress":
          if (!data.file || data.progress === undefined) return;
          setProgressItems((prev) =>
            prev.map((item) =>
              item.file === data.file
                ? { ...item, progress: data.progress!, status: "progress" }
                : item,
            ),
          );
          break;

        case "done":
          if (!data.file) return;
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== data.file),
          );
          break;

        case "ready":
          setReady(true);
          break;

        case "update":
          if (data.output !== undefined) {
            setOutput((prev) => prev + data.output!);
          }
          break;

        case "complete":
          setDisabled(false);
          break;

        default:
          console.warn("Unknown worker message status:", data.status);
      }
    },
    [],
  );

  // Worker initialization and cleanup
  useLayoutEffect(() => {
    // Initialize worker if it doesn't exist
    if (!workerRef.current) {
      try {
        workerRef.current = new Worker(
          new URL("./worker.js", import.meta.url),
          { type: "module" },
        );

        // Add event listener
        workerRef.current.addEventListener("message", handleWorkerMessage);

        // Handle worker errors
        workerRef.current.addEventListener("error", (error) => {
          console.error("Worker error:", error);
          setDisabled(false);
          setReady(false);
        });
      } catch (error) {
        console.error("Failed to create worker:", error);
        setReady(false);
      }
    }

    // Cleanup function
    return () => {
      if (workerRef.current) {
        workerRef.current.removeEventListener("message", handleWorkerMessage);
        workerRef.current.removeEventListener("error", () => {});
      }
    };
  }, [handleWorkerMessage]);

  // Process image with proper error handling
  const processImage = useCallback(
    (customData?: ProcessingRequest) => {
      if (!workerRef.current) {
        console.error("Worker not initialized");
        return;
      }

      if (!ready) {
        console.warn("Worker not ready yet");
        return;
      }

      try {
        setDisabled(true);
        setOutput(""); // Clear previous output

        const messageData = customData || {
          input,
          sourceLanguage,
          targetLanguage,
        };

        workerRef.current.postMessage(messageData);
      } catch (error) {
        console.error("Failed to send message to worker:", error);
        setDisabled(false);
      }
    },
    [ready, input, sourceLanguage, targetLanguage],
  );

  // Manual cleanup function
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
      setReady(false);
      setDisabled(false);
      setProgressItems([]);
      setOutput("");
    }
  }, []);

  return {
    // State
    ready,
    disabled,
    progressItems,
    input,
    sourceLanguage,
    targetLanguage,
    output,

    // Actions
    processImage,
    setInput,
    setSourceLanguage,
    setTargetLanguage,

    // Cleanup
    cleanup,
  };
}
