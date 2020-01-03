import { useLayoutEffect, useEffect } from 'react';

export const useEnhancedEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
