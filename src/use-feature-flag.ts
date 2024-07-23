import { useState, useEffect, useCallback } from "react";

import featureFlags from "./feature-flags.class";

export default function useFeatureFlag(
  key: string,
  initialValue: boolean | null = false
) {
  const [value, setValue] = useState(
    () => featureFlags.getFlag(key) ?? initialValue
  );

  const updateValue = useCallback(() => {
    const flagValue = featureFlags.getFlag(key);
    setValue(flagValue);
  }, [key]);

  useEffect(() => {
    updateValue();
    featureFlags.subscribe(updateValue);
    return () => {
      featureFlags.unsubscribe(updateValue);
    };
  }, [updateValue]);

  return value;
}
