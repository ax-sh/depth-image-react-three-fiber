import {
  DepthEstimationPipeline,
  DepthEstimationPipelineOutput,
  pipeline,
  RawImage,
} from "@xenova/transformers";
import * as process from "node:process";

async function run(imageFilePath: string) {
  const depth_estimator: DepthEstimationPipeline = await pipeline(
    "depth-estimation",
    "Xenova/dpt-hybrid-midas",
  );
  const url = imageFilePath;
  const out = (await depth_estimator(url)) as DepthEstimationPipelineOutput;

  const depth = out.depth;
  const color = await RawImage.read(imageFilePath);
  await depth.save("public/depth.png");
  await color.save("public/color.png");
}
const imageFilePath = process.argv.slice(2)[0];
// @ts-expect-error not a error new version of node supports this
await run(imageFilePath);
console.log("Done");
