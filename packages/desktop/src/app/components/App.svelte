<script lang="ts">
  import TodoContainer from './TodoContainer.svelte';
  import { authStateChanged } from '@today/shared/utils/firebase';
  import { onDestroy, onMount } from 'svelte';
  // import userStore from '@today/shared/store/user';
  // import state from '@today/shared/store/state';

  // const { store } = state;

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

  console.log(authStateChanged, 'WHAT');
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main>
  <!-- {#if $userStore.uid}
    <TodoContainer />
  {/if} -->

  {#await authStateChanged()}
    <p>...waiting</p>
  {:then number}
    <p>The number is {number}</p>
    <TodoContainer />
  {:catch error}
    <p style="color: red">{error}</p>
  {/await}
</main>

<style>
  :global(body) {
    height: calc(100% - 20px);
  }

  main {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 22px;
  }
</style>
