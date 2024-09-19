import {
  Bounds,
  Html,
  OrbitControls,
  Plane,
  shaderMaterial,
  useAspect,
  useBounds,
  useTexture,
} from '@react-three/drei';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { Suspense, useEffect, useRef } from 'react';

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

function ImagePlane() {
  const { depthImagePath, colorImagePath } = useControls({
    depthImagePath: './depth.png',
    colorImagePath: './color.png',
  });

  const { colorMap, depthMap } = useTexture({ colorMap: colorImagePath, depthMap: depthImagePath });

  const aspect = useAspect(depthMap.image.width, depthMap.image.height, 1);

  const depthMaterial = useMouseMovementMaterial();

  return (
    <Plane args={aspect}>
      {/* @ts-expect-error: ignore weird error caused by typescript */}
      <pseudo3DMaterial ref={depthMaterial} uImage={colorMap} uDepthMap={depthMap} />
    </Plane>
  );
}

function LoadingFallback() {
  return <Html center>Loading...</Html>;
}

function useWorker() {
  // Create a reference to the worker object.
  const worker = useRef(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module',
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      // TODO: Will fill in later
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });
  return worker;
}

function App() {
  // Create a reference to the worker object.
  const worker = useWorker();
  console.log(worker);
  return (
    <div className={'w-screen h-screen bg-black'}>
      <Canvas className={'h-full w-full'} camera={{ fov: 35, zoom: 1.3, near: 1, far: 1000 }}>
        <Suspense fallback={<LoadingFallback />}>
          <Bounds fit clip observe margin={1.2}>
            <ImagePlane />
          </Bounds>
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
