<script lang="ts">
  import {
    updateCSSVars,
    getColorsFromCSS,
    variants,
  } from '../../utils/themes';
  import state from '../../store/state';
  import type { Variant } from '../../store/state';
  import { onMount } from 'svelte';
  import { trackView, View } from '../../utils/tracking';

  const currentCSSColors = getColorsFromCSS();
  const { store } = state;

  onMount(() => {
    const customVariants = {} as { [key in Variant]: string };
    variants.forEach((swatch) => {
      const storeOrDOMHexValue =
        $store.theme[swatch] ?? currentCSSColors[swatch].hex;
      // update DOM to include custom vars
      updateCSSVars(swatch, storeOrDOMHexValue);
      // build object to update store
      customVariants[swatch] = storeOrDOMHexValue;
    });

    state.update({ theme: { title: 'Custom', ...customVariants } });

    trackView(View.CUSTOM_THEME_PICKER);
  });
</script>

<div>
  <ul>
    {#each variants as swatch}
      <li>
        <p>{swatch}:</p>
        <span>{$store.theme[swatch] ?? currentCSSColors[swatch].hex}</span>
        <input
          type="color"
          value={$store.theme[swatch] ?? currentCSSColors[swatch].hex}
          on:change={(e) => {
            $store.theme[swatch] = e.currentTarget.value;
            updateCSSVars(swatch, e.currentTarget.value);
          }}
        />
      </li>
    {/each}
  </ul>
</div>

<style>
  input {
    border: none;
    margin: 0;
    appearance: none;
    background: transparent;
    padding: 0;
    cursor: pointer;
    width: 40px;
    height: 40px;
  }

  div {
    display: flex;
  }

  ul {
    width: 100%;
    text-transform: capitalize;
  }

  li {
    display: grid;
    align-items: center;
    grid-template-columns: 2fr 75px 0fr;
  }
</style>
