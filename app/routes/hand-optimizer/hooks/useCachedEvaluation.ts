import { useEffect, useState } from 'react';
import { useHandEvaluator } from './useHandEvaluater';

export const useCachedEvaluation = (
  handKey: string | undefined,
  isMyCrib: boolean
) => {
  const [cachedResult, setCachedResult] = useState<any[] | null>(null);

  const cacheKey = `${handKey}-${isMyCrib ? 'Y' : 'N'}`;

  // Load from localStorage on first render
  useEffect(() => {
    if (typeof window === 'undefined' || !handKey) return;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setCachedResult(JSON.parse(cached));
      } catch {
        setCachedResult(null);
      }
    }
  }, [handKey, isMyCrib]);

  // Only run evaluator if there's no cached result
  const { result, loading } = useHandEvaluator(
    cachedResult ? undefined : handKey,
    isMyCrib
  );

  // Save result to localStorage
  useEffect(() => {
    if (!loading && result && !cachedResult && typeof window !== 'undefined') {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        setCachedResult(result);
      } catch {}
    }
  }, [loading, result, cachedResult, cacheKey]);

  return {
    result: cachedResult ?? result,
    loading: !cachedResult && loading
  };
};
