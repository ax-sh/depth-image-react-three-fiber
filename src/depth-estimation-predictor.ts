import { pipeline } from "@xenova/transformers";

const DEPTH_ESTIMATION = "depth-estimation" as const;
export async function fetchDepthEstimationPipeline() {
  const depth_estimator = await pipeline<typeof DEPTH_ESTIMATION>(
    DEPTH_ESTIMATION,
    "Xenova/dpt-hybrid-midas",
  );

  return depth_estimator;
}
