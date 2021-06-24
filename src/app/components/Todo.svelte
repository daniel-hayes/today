<script lang="ts">
  import linkifyHtml from 'linkifyjs/html';
  import emoji from 'node-emoji';
  import type { Todo } from '../store/state';
  import Meatballs from './Meatballs.svelte';

  export let todo: Todo;
  export let index: number;
  export let setChecked: (id: string, checked: boolean) => void;
  export let update: (id: string, text: string) => void;
  export let remove: (id: string) => void;

  let checkbox: HTMLElement;
  let text: string = transform(todo.text);

  let active = todo.checked ?? false;

  function handleBlur(e: FocusEvent) {
    let updatedText = (e.currentTarget as HTMLElement).innerText;
    text = transform(updatedText);
    update(todo.id, updatedText);
  }

  function transform(text: string) {
    return emoji.emojify(
      linkifyHtml(text, {
        attributes: {
          contenteditable: 'false',
          target: '_blank',
        },
      })
    );
  }

  function deleteTodo() {
    remove(todo.id);
  }
</script>

<div>
  <label class:active>
    <input
      id={todo.id}
      data-checkbox-index={index}
      type="checkbox"
      bind:this={checkbox}
      bind:checked={active}
      on:change={() => setChecked(todo.id, active)}
    />
    <svg class:active width="13" height="13" viewBox="0 0 18 13" fill="none">
      <path
        d="M17.2948 0.294836C17.6843 0.684289 17.6843 1.31572 17.2948 1.70517L5.99998 13L1.20541 8.20543C0.815809 7.81584 0.815808 7.18417 1.20541 6.79457C1.59467 6.40531 2.22567 6.40492 2.61541 6.79371L5.99998 10.17L15.8848 0.294503C16.2743 -0.0946357 16.9055 -0.0944865 17.2948 0.294836Z"
        fill="var(--theme-secondary-color)"
      />
    </svg>
  </label>
  <p
    data-checkbox-text-index={index}
    tabindex="-1"
    contenteditable
    on:blur={handleBlur}
  >
    {@html text}
  </p>

  <span>
    <Meatballs {deleteTodo} />
  </span>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    transition: background ease-in 150ms;
    padding: 4px 10px;
    border-radius: 4px;
    position: relative;
    flex: 1;
  }

  div:hover,
  div:focus-within {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
  }

  span {
    display: none;
  }

  /* only show additional menu items if active */
  div:hover span,
  div:active span,
  div:focus-within span {
    display: block;
  }

  input {
    display: block;
    outline: none;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  label {
    border-radius: 4px;
    width: 18px;
    height: 18px;
    border: 1px solid var(--theme-secondary-color);
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label.active {
    background: var(--theme-accent-color);
    border-color: var(--theme-accent-color);
  }

  svg {
    display: none;
    position: absolute;
  }

  svg.active {
    display: block;
  }

  p {
    flex: 1;
    margin-left: 14px;
    position: relative;
  }

  p:focus {
    outline: none;
  }

  label.active + p {
    text-decoration: line-through;
    opacity: 0.3;
  }
</style>
