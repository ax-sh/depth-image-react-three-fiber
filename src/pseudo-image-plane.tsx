import { Bounds, Plane, useAspect, useBounds, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';

import { useDepthProcessor } from './hooks/use-depth-processor.ts';
import { Pseudo3DMaterial } from './pseudo3d-material.ts';

extend({
  Pseudo3DMaterial,
});

function useMouseMovementMaterial() {
  const bounds = useBounds();
  useEffect(() => {
    bounds.refresh().clip().fit();
  }, [bounds]);
  const delta = 0.01;

  const depthMaterial = useRef<{ uMouse: number[] }>({ uMouse: [0, 0] });
  useFrame(
    (state) => (depthMaterial.current.uMouse = [state.pointer.x * delta, state.pointer.y * delta])
  );
  return depthMaterial;
}

type ImagePlaneProps = {
  colorImageUrl: string;
  depthImageUrl: string;
};
export const ImagePlane = memo(({ colorImageUrl, depthImageUrl }: ImagePlaneProps) => {
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

  const depthMaterial = useMouseMovementMaterial();

  return (
    <Plane args={aspect}>
      {/* @ts-expect-error: ignore unique error caused by typescript */}
      <pseudo3DMaterial
        ref={depthMaterial}
        uImage={colorMap}
        uDepthMap={depthMap}
        side={THREE.DoubleSide}
      />
    </Plane>
  );
});

function FallbackImagePlane() {
  const { depthImagePath, colorImagePath } = useControls({
    depthImagePath: './test_depth.png',
    colorImagePath: './test_color.png',
  });

  // Optional: Add a log to see when this specific part re-renders
  console.log('FallbackImagePlane re-rendered due to useControls change.');

  return <ImagePlane colorImageUrl={colorImagePath} depthImageUrl={depthImagePath} />;
}

export function DepthImagePlane({ files }: { files: File[] }) {
  const { state } = useDepthProcessor(files);

  return (
    <Bounds fit clip observe margin={2}>
      {[files.length > 0, state.colorImage, state.depthImage].every(Boolean) ? (
        <ImagePlane colorImageUrl={state.colorImage} depthImageUrl={state.depthImage} />
      ) : (
        <FallbackImagePlane />
      )}
    </Bounds>
  );
}
