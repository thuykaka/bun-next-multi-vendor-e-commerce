'use client';

import { useCallback, useEffect, useState } from 'react';

export const useScroll = (threshold = 10) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return isScrolled;
};
