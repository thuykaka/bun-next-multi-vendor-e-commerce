import * as React from 'react';

export function useVisibleCategories() {
  const [maxVisibleCategories, setMaxVisibleCategories] =
    React.useState<number>(5);

  React.useEffect(() => {
    const calculateVisibleCategories = () => {
      const width = window.innerWidth;

      if (width < 480) {
        // Mobile nhỏ (iPhone SE, etc.)
        return 2;
      } else if (width < 768) {
        // Mobile thường
        return 3;
      } else if (width < 1024) {
        // Tablet
        return 4;
      } else if (width < 1280) {
        // Desktop nhỏ
        return 5;
      } else if (width < 1536) {
        // Desktop trung bình
        return 8;
      } else {
        // Desktop lớn
        return 10;
      }
    };

    const updateCategories = () => {
      setMaxVisibleCategories(calculateVisibleCategories());
    };

    updateCategories();
    window.addEventListener('resize', updateCategories);

    return () => window.removeEventListener('resize', updateCategories);
  }, []);

  return maxVisibleCategories;
}
