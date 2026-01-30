import { useEffect, useState } from 'react';

export const useHandEvaluator = (
  handKey: string | undefined,
  isMyCrib: boolean
) => {
  const [result, setResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!handKey) return;

    setLoading(true);
    const worker = new Worker(
      new URL('../workers/evaluatorWorker.js', import.meta.url),
      {
        type: 'module'
      }
    );

    worker.postMessage({ handKey, isMyCrib });

    worker.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [handKey, isMyCrib]);

  return { result, loading };
};
