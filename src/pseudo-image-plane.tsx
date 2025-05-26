import { Bounds, Html, Plane, useAspect, useBounds, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useLayoutEffect, useRef } from 'react';
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
export function ImagePlane({ colorImageUrl, depthImageUrl }: ImagePlaneProps) {
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
}

export function DepthImagePlane({ files }: { files: File[] }) {
  const { depthImagePath, colorImagePath } = useControls({
    depthImagePath: './test_depth.png',
    colorImagePath: './test_color.png',
  });
  const { state, eventRef } = useDepthProcessor(files);

  return (
    <Bounds fit clip observe margin={2}>
      <Html>
        <pre>{JSON.stringify(eventRef.current, null, 2)}</pre>
      </Html>
      {state.colorImage && state.depthImage ? (
        <ImagePlane colorImageUrl={state.colorImage} depthImageUrl={state.depthImage} />
      ) : (
        <ImagePlane colorImageUrl={colorImagePath} depthImageUrl={depthImagePath} />
      )}
    </Bounds>
  );
}
