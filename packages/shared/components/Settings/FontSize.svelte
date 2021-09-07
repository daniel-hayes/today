<script lang="ts">
  import state from '../../store/state';
  import { setFontSize } from '../../utils/fontSize';

  const { store } = state;

  function updateFontSize(size: number) {
    setFontSize(size);
    state.update({ fontSize: size });
  }
</script>

<div>
  <button
    class:selected={$store.fontSize === 12}
    on:click={() => updateFontSize(12)}
  >
    <svg viewBox="0 0 448 512"
      ><path
        d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"
      /></svg
    ></button
  >
  <button
    class:selected={$store.fontSize === 14 || !$store.fontSize}
    on:click={() => updateFontSize(14)}
  >
    <svg viewBox="0 0 448 512"
      ><path
        d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"
      /></svg
    ></button
  >
  <button
    class:selected={$store.fontSize === 16}
    on:click={() => updateFontSize(16)}
  >
    <svg viewBox="0 0 448 512"
      ><path
        d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"
      /></svg
    ></button
  >
</div>

<style>
  .selected {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 8%)
    );
  }

  div {
    display: flex;
    justify-content: space-between;
  }

  button {
    width: 28px;
    height: 28px;
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1.5px 1px rgba(0, 0, 0, 0.15);
    font-size: 13px;
    font-weight: 600;
    color: inherit;
  }

  button:nth-child(1) {
    border-radius: 3px 0 0 3px;
  }

  button:nth-child(1) svg {
    width: 8px;
  }

  button:nth-child(2) svg {
    width: 11px;
  }

  button:nth-child(2) {
    border-radius: 0;
  }

  button:nth-child(3) svg {
    width: 13px;
  }

  button:nth-child(3) {
    border-radius: 0 3px 3px 0;
  }

  button svg {
    margin: 0;
    fill: currentColor;
  }
</style>
