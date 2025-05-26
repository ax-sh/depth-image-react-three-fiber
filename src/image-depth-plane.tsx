import { Plane, useAspect, useBounds, useTexture } from '@react-three/drei';
import { memo, useLayoutEffect } from 'react';
import * as THREE from 'three';

export type ImagePlaneProps = {
  colorImageUrl: string;
  depthImageUrl: string;
};
export const ImageDepthPlane = memo(({ colorImageUrl, depthImageUrl }: ImagePlaneProps) => {
  const { colorMap, depthMap } = useTexture({
    colorMap: colorImageUrl,
    depthMap: depthImageUrl,
  });
  const bounds = useBounds();

  const aspect = useAspect(depthMap.image.width, depthMap.image.height, 1);
  useLayoutEffect(() => {
    // console.log(aspect, 333);
    bounds.refresh().clip().fit();
  }, [bounds]);

  // const depthMaterial = useMouseMovementMaterial();

  return (
    <Plane args={aspect}>
      <meshStandardMaterial
        map={colorMap}
        side={THREE.DoubleSide}
        needsUpdate
        displacementScale={100.75}
        displacementMap={depthMap}
      />
    </Plane>
  );
});
