<script lang="ts">
  import TodoContainer from './TodoContainer.svelte';
  import { onDestroy, onMount } from 'svelte';

  // setup listeners
  const blur = (e: KeyboardEvent) => {
    const editableElement = (e.target as HTMLElement).hasAttribute(
      'contenteditable'
    );

    if (editableElement && (e.key === 'Enter' || e.key === 'Escape')) {
      (document.activeElement as HTMLElement).blur();
    }
  };

  onMount(() => {
    document.addEventListener('keydown', blur);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', blur);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main>
  <TodoContainer />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 22px;
  }
</style>
