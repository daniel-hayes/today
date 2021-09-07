<script lang="ts">
  import Modal from '../Modal.svelte';

  let isOpen = false;

  function toggleModal() {
    isOpen = !isOpen;
  }
</script>

<Modal {isOpen} close={() => (isOpen = false)}>
  <div slot="trigger">
    <button on:click={toggleModal} />
  </div>
  <div slot="header" />
  <div slot="content" />
  <footer slot="footer" />
</Modal>

<style>
  button {
    color: var(--theme-secondary-color);
    opacity: 1;
    padding: 6px 10px;
    border-radius: 4px;
  }

  button:hover,
  button:focus {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
  }

  footer {
    padding-bottom: 12px;
  }
</style>
