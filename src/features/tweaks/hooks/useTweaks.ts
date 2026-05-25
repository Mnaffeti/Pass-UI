import { useState, useCallback } from 'react';
import type { TweakValues } from '@/types';

export function useTweaks(defaults: TweakValues): [TweakValues, (keyOrEdits: keyof TweakValues | Partial<TweakValues>, val?: TweakValues[keyof TweakValues]) => void] {
  const [values, setValues] = useState<TweakValues>(defaults);

  const setTweak = useCallback(
    (keyOrEdits: keyof TweakValues | Partial<TweakValues>, val?: TweakValues[keyof TweakValues]) => {
      const edits =
        typeof keyOrEdits === 'object' && keyOrEdits !== null
          ? keyOrEdits
          : { [keyOrEdits as keyof TweakValues]: val };
      setValues((prev) => ({ ...prev, ...edits }));
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
      window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
    },
    [],
  );

  return [values, setTweak];
}
