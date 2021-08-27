import { onDestroy } from 'svelte';

function onInterval(callback: () => void, milliseconds: number): void {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
}

export default onInterval;
