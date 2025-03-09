import React from 'react';

declare global {
  namespace React {
    interface Fragment {
      key?: string | number;
      children?: React.ReactNode;
    }
  }
} 