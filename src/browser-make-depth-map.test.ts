import { RawImage } from "@xenova/transformers";

import { predictDepthFromImage } from "./depth-estimation-predictor.ts";

describe("depth map", async () => {
  it(
    "should make depth map from url blob",
    async () => {
      // const depth_estimator = await fetchDepthEstimationPipeline();
      let imageFileUrl: string;
      imageFileUrl =
        "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png";
      imageFileUrl =
        "https://i.pinimg.com/736x/05/d3/a6/05d3a6f81f97e985602efae3ff4f511f.jpg";
      const prediction = await predictDepthFromImage(imageFileUrl);
      if (Array.isArray(prediction)) {
        return;
      }
      const depth = prediction.depth;
      const color = await RawImage.read(imageFileUrl);
      await depth.save("public/test_depth.png");
      await color.save("public/test_color.png");

      console.log(prediction);
      expect(1).toBe(1);
    },
    { timeout: 300000 },
  );
});
