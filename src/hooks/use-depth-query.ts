import { useQuery } from '@tanstack/react-query';

// import * as Comlink from 'comlink';
//
// import { useAppStore } from './store.ts';

const depthWorker = new ComlinkWorker<typeof import('./worker')>(
  new URL('./worker', import.meta.url),
  {
    name: 'calculationsComLink',
    type: 'module',
    /* normal Worker options*/
  }
);

// // Expose an API for the worker to call
// const mainThreadAPI = {
//   updateZustandState: (newStatus: unknown) => {
//     useAppStore.getState().setStatus(newStatus);
//   },
// };
//
// Comlink.expose(mainThreadAPI, depthWorker.);

export function useDepthQuery(file: File | null) {
  return useQuery({
    queryKey: ['depth-image', file],
    queryFn: async () => {
      if (!file) throw new Error('No file provided'); // optional safeguard
      const r = await depthWorker.run(file);
      console.log(r, '>>>>>');
      return r;
    },
    enabled: !!file,
    staleTime: Infinity,
  });
}
