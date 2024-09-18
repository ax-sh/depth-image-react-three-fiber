import { DepthEstimationPipeline, RawImage, pipeline } from '@xenova/transformers';
import { DepthEstimationPipelineOutput } from '@xenova/transformers/types/pipelines';
import * as process from 'node:process';

async function run(imageFilePath: string) {
  const depth_estimator: DepthEstimationPipeline = await pipeline(
    'depth-estimation',
    'Xenova/dpt-hybrid-midas'
  );
  const url = imageFilePath;
  const out: DepthEstimationPipelineOutput = await depth_estimator(url);

  const depth = out.depth;
  const color = await RawImage.read(imageFilePath);
  await depth.save('public/depth.png');
  await color.save('public/color.png');
}
const imageFilePath = process.argv.slice(2)[0];
await run(imageFilePath);
console.log('Done');
