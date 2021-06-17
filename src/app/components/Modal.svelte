<script lang="ts">
  import { fly } from 'svelte/transition';

  import Hr from './Hr.svelte';
  export let isOpen = false;
  export let close: () => void;

  function keydown(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Escape') {
      close();
    }
  }

  document.addEventListener('keydown', keydown);
</script>

<slot name="trigger" />

{#if isOpen}
  <div in:fly={{ y: 3 }} out:fly={{ duration: 200 }} class="modal">
    <div class="backdrop" on:click={close} />
    <div />

    <div class="wrapper">
      <slot name="header" />

      <Hr />

      <div>
        <slot name="content" />
      </div>

      <slot name="footer" />
    </div>
  </div>
{/if}

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    justify-content: center;
    z-index: 9;
    overflow: scroll;
    grid-template-rows: 0 1fr;
    align-items: center;
  }

  .backdrop {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) - 5%)
    );
    opacity: 0.98;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .wrapper {
    box-sizing: border-box;
    background: var(--theme-primary-color);
    padding: 0 14px;
    overflow: hidden;
    z-index: 10;
    border-radius: 6px;
    box-shadow: 6px 3px 10px rgb(0 0 0 / 8%);
    width: 100vw;
    height: 100vh;
  }

  @media screen and (min-width: 350px) {
    .wrapper {
      width: 350px;
      height: fit-content;
    }
  }
</style>
