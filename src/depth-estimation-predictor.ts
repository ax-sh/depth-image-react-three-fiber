import { DepthEstimationPipeline, pipeline } from "@xenova/transformers";
import { ImagePipelineInputs } from "@xenova/transformers/types/pipelines";

const DEPTH_ESTIMATION = "depth-estimation" as const;

class DepthEstimationService {
  private static instance: DepthEstimationService | null = null;
  private static initPromise: Promise<DepthEstimationService> | null = null;
  private readonly predictor: DepthEstimationPipeline;

  private constructor(predictor: DepthEstimationPipeline) {
    this.predictor = predictor;
  }

  static async getInstance(): Promise<DepthEstimationService> {
    if (!this.initPromise) {
      this.initPromise = this.createInstance();
    }
    return this.initPromise;
  }

  private static async createInstance(): Promise<DepthEstimationService> {
    if (!this.instance) {
      const predictor = await pipeline<typeof DEPTH_ESTIMATION>(
        DEPTH_ESTIMATION,
        "Xenova/dpt-hybrid-midas",
      );
      this.instance = new DepthEstimationService(predictor);
    }
    return this.instance;
  }

  async predict(image: ImagePipelineInputs) {
    return await this.predictor(image);
  }

  // Add more methods as needed
  async batchPredict(images: ImagePipelineInputs[]) {
    return Promise.all(images.map((img) => this.predict(img)));
  }
}

export async function predictDepthFromImage(image: ImagePipelineInputs) {
  const service = await DepthEstimationService.getInstance();
  return await service.predict(image);
}

//functional approach
//import { DepthEstimationPipeline, pipeline } from '@xenova/transformers';
// import { ImagePipelineInputs } from '@xenova/transformers/types/pipelines';
//
// const DEPTH_ESTIMATION = 'depth-estimation' as const;
//
// let predictorInstance: DepthEstimationPipeline | null = null;
// let initPromise: Promise<DepthEstimationPipeline> | null = null;
//
// async function getPredictor(): Promise<DepthEstimationPipeline> {
//   if (!initPromise) {
//     initPromise = pipeline<typeof DEPTH_ESTIMATION>(
//       DEPTH_ESTIMATION,
//       'Xenova/dpt-hybrid-midas'
//     );
//     predictorInstance = await initPromise;
//   }
//   return predictorInstance;
// }
//
// export async function predictDepthFromImage(image: ImagePipelineInputs) {
//   const predictor = await getPredictor();
//   return await predictor(image);
// }
//
// export async function batchPredictDepth(images: ImagePipelineInputs[]) {
//   const predictor = await getPredictor();
//   return Promise.all(images.map(img => predictor(img)));
// }
