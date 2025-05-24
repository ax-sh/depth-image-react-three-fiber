import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { PropsWithChildren, Suspense } from "react";

import { DepthImagePlane } from "./pseudo-image-plane.tsx";

function LoadingFallback() {
  return <Html center>Loading...</Html>;
}

function Studio({ children }: PropsWithChildren) {
  return (
    <div className={"w-screen h-screen bg-black"}>
      <Canvas
        className={"h-full w-full"}
        camera={{ fov: 35, zoom: 1.3, near: 1, far: 1000 }}
      >
        <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
      </Canvas>
    </div>
  );
}

function App() {
  return (
    <Studio>
      <DepthImagePlane />
      <OrbitControls />
    </Studio>
  );
}

export default App;
