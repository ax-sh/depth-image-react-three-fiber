import {
  Bounds,
  Plane,
  useAspect,
  useBounds,
  useTexture,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { Pseudo3DMaterial } from "./pseudo3d-material.ts";

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
    (state) => (depthMaterial.current.uMouse = [
      state.pointer.x * delta,
      state.pointer.y * delta,
    ]),
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

  const aspect = useAspect(depthMap.image.width, depthMap.image.height, 1);

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

export function DepthImagePlane() {
  const { depthImagePath, colorImagePath } = useControls({
    depthImagePath: "./depth.png",
    colorImagePath: "./color.png",
  });
  return (
    <Bounds fit clip observe margin={1.2}>
      <ImagePlane
        colorImageUrl={colorImagePath}
        depthImageUrl={depthImagePath}
      />
    </Bounds>
  );
}
