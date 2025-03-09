import 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  export type MouseEvent<T = Element, E = NativeMouseEvent> = React.UIEvent<T, E> & {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
  };
  
  export type ChangeEvent<T = Element> = React.UIEvent<T, NativeChangeEvent> & {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
  };
  
  export type SyntheticEvent<T = Element, E = Event> = React.UIEvent<T, E> & {
    target: EventTarget & T;
    currentTarget: EventTarget & T;
  };
  
  export interface UIEvent<T = Element, E = Event> extends React.BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
  
  export interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    isDefaultPrevented(): boolean;
    stopPropagation(): void;
    isPropagationStopped(): boolean;
    persist(): void;
    timeStamp: number;
    type: string;
  }
  
  export function useState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>];
  
  export function useEffect(effect: React.EffectCallback, deps?: React.DependencyList): void;
  
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T;
  
  export function useRef<T>(initialValue: T): React.MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): React.RefObject<T>;
  export function useRef<T = undefined>(): React.MutableRefObject<T | undefined>;
  
  export type SetStateAction<S> = S | ((prevState: S) => S);
  export type Dispatch<A> = (value: A) => void;
  export type EffectCallback = () => void | (() => void);
  export type DependencyList = ReadonlyArray<any>;
  export type MutableRefObject<T> = { current: T };
  export type RefObject<T> = { readonly current: T | null };
  export type RefCallback<T> = (instance: T | null) => void;
}

export {}; 