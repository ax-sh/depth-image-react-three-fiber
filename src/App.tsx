import { Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { type PropsWithChildren, Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from './hooks/store.ts';
import { useImageFileDropZone } from './hooks/use-image-file-drop-zone.ts';
import { DepthImagePlane } from './pseudo-image-plane.tsx';

function LoadingFallback() {
  return <Html center>Loading...</Html>;
}

function Studio({ children }: PropsWithChildren) {
  return (
    <Canvas className={'h-full w-full'} camera={{ fov: 3, zoom: 1.3, near: 0.1, far: 1000 }}>
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
    </Canvas>
  );
}

function DragInfo({ children }: PropsWithChildren) {
  return (
    <section
      className={
        'absolute top-0 left-0 w-full h-full pointer-events-none grid place-items-center  bg-black/50'
      }
    >
      {children}
    </section>
  );
}

function App() {
  const { files, getRootProps, isDragActive } = useImageFileDropZone();
  const status = useAppStore(useShallow((state) => state.status));

  return (
    <main className={'w-screen h-screen bg-black relative'} {...getRootProps()}>
      <Studio>
        <DepthImagePlane files={files} />
        <OrbitControls />
      </Studio>
      <div id={'status'} className={'absolute top-0 left-0 w-full h-full pointer-events-none'}>
        {JSON.stringify(status)}
      </div>

      {isDragActive ? <DragInfo>Drop the files here ...</DragInfo> : null}
    </main>
  );
}

export default App;
