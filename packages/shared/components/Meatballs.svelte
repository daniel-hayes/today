<script lang="ts">
  import { backOut } from 'svelte/easing';

  export let deleteTodo: () => void;
  let isOpen = false;

  function handleClick() {
    isOpen = !isOpen;
  }

  function fadeScale(
    node: HTMLElement,
    { duration, easing = (t: number) => t, baseScale }
  ) {
    const o = +getComputedStyle(node).opacity;
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const s = m ? Number(m[1]) : 1;
    const is = 1 - baseScale;

    return {
      delay: 0,
      duration,
      css: (t: number) => {
        const eased = easing(t);
        return `opacity: ${eased * o}; transform: scale(${
          eased * s * is + baseScale
        })`;
      },
    };
  }

  function close() {
    isOpen = false;
  }
</script>

<button class="meatballs" on:click={handleClick}>
  <svg
    width="13"
    height="3"
    viewBox="0 0 13 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6.5" cy="1.5" r="1.5" />
    <circle cx="1.5" cy="1.5" r="1.5" />
    <circle cx="11.5" cy="1.5" r="1.5" />
  </svg>
</button>

{#if isOpen}
  <div class="backdrop" on:click={close} />
  <div
    in:fadeScale={{
      duration: 200,
      easing: backOut,
      baseScale: 0.95,
    }}
  >
    <ul>
      <li>
        <button class="action" on:click={() => deleteTodo()}
          ><svg
            width="13"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            ><path
              d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
            /></svg
          >
          <p>Delete</p></button
        >
      </li>
    </ul>
  </div>
{/if}

<style>
  div {
    position: absolute;
    top: calc(100% - 10px);
    right: 1px;
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
    box-shadow: 1px 1px 4px 0px rgb(0 0 0 / 20%);
    z-index: 1;
  }

  .backdrop {
    background: transparent;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  button {
    color: var(--theme-secondary-color);
  }

  .meatballs {
    opacity: 0.3;
    padding: 14px 0 14px 10px;
    display: flex;
    align-items: center;
  }

  .meatballs:hover,
  .meatballs:focus {
    opacity: 1;
  }

  .action {
    display: flex;
    align-items: center;
    padding: 6px 12px;
  }

  .action:hover,
  .action:focus {
    background: var(--theme-primary-color);
  }

  .action svg {
    opacity: 0.8;
  }

  li {
    font-size: calc(var(--font-size) - 2px);
  }

  p {
    margin: 0;
    margin-left: 8px;
  }

  circle,
  path {
    fill: currentColor;
  }
</style>
