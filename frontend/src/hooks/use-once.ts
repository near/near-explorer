import React from "react";

export const useOnce = (fn: () => void) => {
  if (typeof window === "undefined") {
    fn();
  } else {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), [setMounted]);
    if (!mounted) {
      fn();
    }
  }
};
