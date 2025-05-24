import { Bounds, Plane, shaderMaterial, useAspect, useBounds, useTexture } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useRef } from 'react';

extend({
  Pseudo3DMaterial: shaderMaterial(
    { uMouse: [0, 0], uImage: null, uDepthMap: null },
    `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }`,
    `
    precision mediump float;

    uniform vec2 uMouse;
    uniform sampler2D uImage;
    uniform sampler2D uDepthMap;

    varying vec2 vUv;
  
    vec4 linearTosRGB( in vec4 value ) {
      return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
    }
    
    
    void main() {
       vec4 depthDistortion = texture2D(uDepthMap, vUv);
       float parallaxMult = depthDistortion.r;

       vec2 parallax = (uMouse) * parallaxMult;

       vec4 original = texture2D(uImage, (vUv + parallax));
       gl_FragColor = linearTosRGB(original);
    }
    `
  ),
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
  const { colorMap, depthMap } = useTexture({ colorMap: colorImageUrl, depthMap: depthImageUrl });

  const aspect = useAspect(depthMap.image.width, depthMap.image.height, 1);

  const depthMaterial = useMouseMovementMaterial();

  return (
    <Plane args={aspect}>
      {/* @ts-expect-error: ignore unique error caused by typescript */}
      <pseudo3DMaterial ref={depthMaterial} uImage={colorMap} uDepthMap={depthMap} />
    </Plane>
  );
}

export function DepthImagePlane() {
  const { depthImagePath, colorImagePath } = useControls({
    depthImagePath: './depth.png',
    colorImagePath: './color.png',
  });
  return (
    <Bounds fit clip observe margin={1.2}>
      <ImagePlane colorImageUrl={colorImagePath} depthImageUrl={depthImagePath} />
    </Bounds>
  );
}
