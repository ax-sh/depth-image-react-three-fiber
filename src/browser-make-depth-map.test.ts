import { predictDepthFromImage } from './depth-estimation-predictor.ts';

describe('depth map', async () => {
  it(
    'should make depth map from url blob',
    async () => {
      // const depth_estimator = await fetchDepthEstimationPipeline();
      const url =
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
      const prediction = await predictDepthFromImage(url);
      console.log(prediction);
      expect(1).toBe(1);
    },
    { timeout: 300000 }
  );
});
