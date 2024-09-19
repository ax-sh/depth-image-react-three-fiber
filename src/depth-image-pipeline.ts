import { DepthEstimationPipeline, pipeline } from '@xenova/transformers';

export class DepthImagePipeline {
  static task = 'depth-estimation' as const;
  static model = 'Xenova/dpt-hybrid-midas';
  static instance: Promise<DepthEstimationPipeline> = null!;
  // static instance: Promise<AllTasks['depth-estimation']>;

  static async getInstance(progress_callback: CallableFunction) {
    if (this.instance === null) {
      this.instance = pipeline<'depth-estimation'>(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}
