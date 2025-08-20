import type { NavigateFunction, NavigateOptions } from 'react-router-dom';

let navigator: NavigateFunction | null = null;

export function setNavigator(navigate: NavigateFunction) {
  navigator = navigate;
}

export function navigateTo(path: string, state?: unknown, options?: NavigateOptions) {
  if (navigator) {
    navigator(path, { state, ...options });
  } else {
    window.location.href = path;
  }
}
