import { RawImage } from '@xenova/transformers';

import { predictDepthFromImage } from './depth-estimation-predictor.ts';

describe('depth map', async () => {
  it('should make depth map from url blob', async () => {
    // const depth_estimator = await fetchDepthEstimationPipeline();
    let imageFileUrl: string;
    imageFileUrl =
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
    imageFileUrl =
      'https://images.unsplash.com/photo-1747901718105-bf9beb57ba3a?q=80&w=4287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
    const prediction = await predictDepthFromImage(imageFileUrl);
    if (Array.isArray(prediction)) {
      throw new Error('not supported');
    }
    const depth = prediction.depth;
    const color = await RawImage.read(imageFileUrl);
    await depth.save('public/test_depth.png');
    await color.save('public/test_color.png');

    console.log(prediction);
    expect(1).toBe(1);
  }, 300000);
});
