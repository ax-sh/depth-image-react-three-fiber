import { DepthEstimationPipeline, RawImage, pipeline } from '@xenova/transformers';

const imageFile = process.argv.slice(2)[0];
const depth_estimator: DepthEstimationPipeline = await pipeline(
  'depth-estimation',
  'Xenova/dpt-hybrid-midas'
);
const url = imageFile;
const out = await depth_estimator(url);
const depth = out.depth;
const color = await RawImage.read(imageFile);
await depth.save('public/depth.png');
await color.save('public/color.png');

console.log("Done");
