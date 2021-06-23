<script lang="ts">
  import { backOut } from 'svelte/easing';

  export let deleteTodo: () => void;
  let isOpen = false;

  function handleClick(e) {
    console.log(e.currentTarget);
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
      <!-- @TODO not ready yet. still need to design this -->
      <!-- <li>
        <button class="action"
          ><svg
            width="14"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            ><path
              d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"
            /></svg
          >
          <p>Focus</p></button
        >
      </li> -->
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
    font-size: 12px;
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
