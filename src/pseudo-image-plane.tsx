import { Bounds, Html, Plane, useAspect, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { memo, useRef } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';
import * as THREE from 'three';

// import { useDepthProcessor } from './hooks/use-depth-processor.ts';
import { useDepthQuery } from './hooks/use-depth-query.ts';
import { ImagePlaneProps } from './image-depth-plane.tsx';
import { Pseudo3DMaterial } from './pseudo3d-material.ts';

extend({ Pseudo3DMaterial });

function useMouseMovementMaterial() {
  // const bounds = useBounds();
  // useEffect(() => {
  //   bounds.refresh().clip().fit();
  // }, [bounds]);
  const delta = 0.01;

  const depthMaterial = useRef<{ uMouse: number[] }>({ uMouse: [0, 0] });
  useFrame(
    (state) => (depthMaterial.current.uMouse = [state.pointer.x * delta, state.pointer.y * delta])
  );
  return depthMaterial;
}

export const ImagePlane = memo(({ colorImageUrl, depthImageUrl }: ImagePlaneProps) => {
  const { colorMap, depthMap } = useTexture({
    colorMap: colorImageUrl,
    depthMap: depthImageUrl,
  });
  // const bounds = useBounds();

  const aspect = useAspect(depthMap.image.width, depthMap.image.height, 1);
  // useLayoutEffect(() => {
  //   // console.log(aspect, 333);
  //   bounds.refresh().clip().fit();
  // }, [bounds]);

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

const defaultImagePaths = {
  colorImagePath: './test_color.png',
  depthImagePath: './test_depth.png',
};

function FallbackImagePlane() {
  const { depthImagePath, colorImagePath } = useControls(defaultImagePaths);

  return <ImagePlane colorImageUrl={colorImagePath} depthImageUrl={depthImagePath} />;
}

export function DepthImagePlane({ files }: { files: File[] }) {
  // const { state } = useDepthProcessor(files);
  const { data, isLoading } = useDepthQuery(files?.[0]);
  if (isLoading)
    return (
      <Html center={true} className={'whitespace-nowrap text-4xl text-white'}>
        Processing dropped image, might take a while as the model is large initially{' '}
        <ClimbingBoxLoader />
      </Html>
    );
  if (!data)
    return (
      <Bounds fit clip observe margin={2} maxDuration={0}>
        <Html
          center={true}
          className={'whitespace-nowrap text-shadow-lg/30 text-3xl pointer-events-none text-white'}
        >
          Drop file here to process
        </Html>
        <FallbackImagePlane />
      </Bounds>
    );
  const state = data;

  return (
    <Bounds fit clip observe margin={2} maxDuration={0}>
      {/*<ambientLight intensity={0.5} />*/}
      {[state.colorImage, state.depthImage].every(Boolean) ? (
        <ImagePlane colorImageUrl={state.colorImage} depthImageUrl={state.depthImage} />
      ) : (
        <FallbackImagePlane />
      )}
    </Bounds>
  );
}
