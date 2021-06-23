<script lang="ts">
  import { fly } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import uuid from '../uuid';
  import Todo from './Todo.svelte';
  import state, { Todo as TodoType } from '../store/state';
  import Settings from './Settings/Settings.svelte';
  import onInterval from '../onInterval';
  import { getColorsFromCSS, updateCSSVars, variants } from '../themes';
  import { onMount } from 'svelte';
  import bridge, { Action, Channel } from '../bridge';
  import { trackEvent } from '../tracking';

  const { store } = state;
  let todos: TodoType[] = $store.todos;
  let inputValue = '';
  let input: HTMLInputElement;

  function clearTodos() {
    state.setTodos([]);
    todos = [];
  }

  function shouldClearTodos() {
    if (new Date($store.expires) <= new Date()) {
      clearTodos();
    }
  }

  function addTodo() {
    if (inputValue) {
      todos = [
        ...todos,
        {
          text: inputValue,
          id: uuid(),
          checked: false,
        },
      ];
      inputValue = '';
      state.setTodos(todos);

      trackEvent('Form', 'submit');
    }
  }

  function updateTodo(id: string, text: string) {
    const storedTodos: TodoType[] = $store.todos;
    const updatedTodos = storedTodos.map((todo) => {
      if (todo.id === id) {
        todo.text = text;
      }

      return todo;
    });
    state.setTodos(updatedTodos);

    trackEvent('Todo', 'update');
  }

  const setChecked = (id: string, checked: boolean) => {
    const storedTodos: TodoType[] = $store.todos;
    const updatedTodos = storedTodos.map((todo) => {
      if (todo.id === id) {
        todo.checked = checked;
      }

      return todo;
    });
    state.setTodos(updatedTodos);

    trackEvent('Todo', 'check');
  };

  function deleteTodo(id: string) {
    const index = todos.findIndex((todo) => todo.id === id);
    todos.splice(index, 1);
    todos = todos;
    state.setTodos(todos);

    trackEvent('Todo', 'delete');
  }

  // call on first render
  shouldClearTodos();

  // periodically check if todos should clear
  onInterval(shouldClearTodos, 10000);

  onMount(() => {
    if ($store.theme.title === 'Custom') {
      const currentCSSColors = getColorsFromCSS();
      variants.forEach((swatch) => {
        const storeOrDOMHexValue =
          $store.theme[swatch] ?? currentCSSColors[swatch].hex;
        // update DOM to include custom vars
        updateCSSVars(swatch, storeOrDOMHexValue);
      });
    }

    bridge(Channel.SHORTCUT, (action: Action) => {
      if (action === Action.DELETE) {
        if (document.activeElement) {
          const checkboxIndex = (document.activeElement as HTMLInputElement)
            .dataset.checkboxIndex;
          const checkboxTextIndex = (document.activeElement as HTMLInputElement)
            .dataset.checkboxTextIndex;

          if (checkboxIndex) {
            deleteTodo(document.activeElement.id);
          }

          if (checkboxTextIndex) {
            const checkbox = document.querySelector(
              `[data-checkbox-index="${checkboxTextIndex}"]`
            );
            (checkbox as HTMLInputElement).focus();
            deleteTodo(document.activeElement.id);
          }
        }
      }

      if (action === Action.CLEAR) {
        const unchecked = $store.todos.filter((todo) => !todo.checked);
        state.setTodos(unchecked);
        todos = unchecked;
      }

      if (action === Action.RESET) {
        clearTodos();
      }
    });
  });
</script>

<svelte:head>
  {#if $store.theme.file}
    <link href={`themes/${$store.theme.file}`} rel="stylesheet" />
  {/if}
</svelte:head>

<form on:submit|preventDefault={addTodo}>
  <span>
    <button type="submit" tabindex="-1">
      <svg
        fill="var(--theme-secondary-color)"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        ><path
          fill-rule="evenodd"
          d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
        /></svg
      >
    </button>

    <input
      id="create"
      bind:value={inputValue}
      bind:this={input}
      type="text"
      placeholder="What do you need to do?"
    />
  </span>
</form>
<ul class:list={todos.length > 0}>
  {#each todos as todo, index (todo.id)}
    <li
      in:fly={{ y: 4, duration: 150, easing: backOut }}
      out:fly={{ y: -2, duration: 150 }}
    >
      <Todo
        {todo}
        update={updateTodo}
        remove={deleteTodo}
        {setChecked}
        index={index + 1}
      />
    </li>
  {/each}
</ul>
<Settings />

<style>
  form {
    text-align: center;
    width: 100%;
  }

  ul {
    width: 100%;
  }

  span {
    position: relative;
  }

  button {
    position: absolute;
    padding: 0;
    top: 50%;
    left: 11px;
    margin-top: -10px;
  }

  input {
    box-sizing: border-box;
    white-space: nowrap;
    background: transparent;
    border: none;
    margin: 0;
    appearance: none;
    color: var(--theme-secondary-color);
    width: 100%;
    padding: 16px 12px 16px 45px;
    border-radius: 4px;
  }

  input::placeholder {
    color: var(--theme-secondary-color);
    opacity: 0.5;
  }

  input:hover,
  input:active,
  input:focus-visible {
    outline: none;
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
  }
  svg {
    opacity: 0.3;
  }
</style>
