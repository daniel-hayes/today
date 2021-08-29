<script lang="ts">
  import Modal from '../Modal.svelte';
  import { getThemes, resetCustomThemeFromDOM } from '../../utils/themes';
  import Hr from '../Hr.svelte';
  import state from '../../store/state';
  import type { Theme } from '../../store/state';
  import CustomThemePicker from './CustomThemePicker.svelte';
  import { trackEvent, trackView, View } from '../../utils/tracking';

  const themes = getThemes();
  const { store } = state;

  let selectedTheme: Theme;
  let customThemePicker = false;
  let isOpen = false;

  function loadTheme(theme: Theme) {
    selectedTheme = theme;
    state.update({ theme: selectedTheme });
    resetCustomThemeFromDOM();

    trackEvent('Theme', 'load');
  }

  function enableCustomPicker() {
    customThemePicker = !customThemePicker;
  }

  function toggleModal() {
    isOpen = !isOpen;

    if (isOpen) {
      trackView(View.THEME_MODAL);
    }
  }
</script>

<svelte:head>
  {#if selectedTheme?.file}
    <link href={`themes/${selectedTheme.file}`} rel="stylesheet" />
  {/if}
</svelte:head>

<Modal {isOpen} close={() => (isOpen = false)}>
  <div slot="trigger">
    <button on:click={toggleModal}>{$store.theme.title}</button>
  </div>
  <div slot="header">
    {#if customThemePicker}
      <h1>Create theme</h1>
    {:else}
      <h1>Select a theme</h1>
    {/if}
  </div>
  <div slot="content">
    {#if customThemePicker}
      <CustomThemePicker />
    {:else}
      <ul>
        {#each themes as theme}
          <li>
            <button on:click={() => loadTheme(theme)}>{theme.title}</button>
          </li>
        {/each}
        <li><button on:click={enableCustomPicker}>Custom</button></li>
      </ul>
    {/if}
  </div>
  <footer slot="footer">
    {#if customThemePicker}
      <Hr />
      <button on:click={enableCustomPicker}>Back</button>
    {/if}
  </footer>
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

  li {
    margin-bottom: 6px;
  }

  footer {
    padding-bottom: 12px;
  }
</style>
