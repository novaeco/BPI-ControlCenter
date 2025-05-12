import { useEffect, useState } from 'react';

export const useFadeAnimation = (isVisible: boolean, duration = 300) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) setShouldRender(true);
    const timer = setTimeout(
      () => {
        if (!isVisible) setShouldRender(false);
      },
      duration
    );
    return () => clearTimeout(timer);
  }, [isVisible, duration]);

  return {
    shouldRender,
    style: {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: isVisible ? 1 : 0
    }
  };
};

export const useSlideAnimation = (isVisible: boolean, direction: 'left' | 'right' | 'up' | 'down' = 'right', duration = 300) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) setShouldRender(true);
    const timer = setTimeout(
      () => {
        if (!isVisible) setShouldRender(false);
      },
      duration
    );
    return () => clearTimeout(timer);
  }, [isVisible, duration]);

  const getTransform = () => {
    const distance = '100%';
    switch (direction) {
      case 'left': return `translateX(-${distance})`;
      case 'right': return `translateX(${distance})`;
      case 'up': return `translateY(-${distance})`;
      case 'down': return `translateY(${distance})`;
    }
  };

  return {
    shouldRender,
    style: {
      transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
      transform: isVisible ? 'none' : getTransform(),
      opacity: isVisible ? 1 : 0
    }
  };
};