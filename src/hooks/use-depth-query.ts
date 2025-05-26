import { useQuery } from '@tanstack/react-query';

const depthWorker = new ComlinkWorker<typeof import('../worker')>(
  new URL('../worker', import.meta.url),
  {
    name: 'calculationsComLink',
    type: 'module',
    /* normal Worker options*/
  }
);

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
