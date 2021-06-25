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
  import { flip } from 'svelte/animate';

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

  let draggable: HTMLElement;
  let grabbed: HTMLElement;
  let position = {
    mouseY: 0,
    offsetY: 0,
    draggableY: 0, // distance from top of list to top of client
  };

  function handleMouseMove(e: MouseEvent) {
    e.stopPropagation();
    drag(e.clientY);
  }

  function handleMouseEnter(e: MouseEvent) {
    e.stopPropagation();
    dragEnter(e.target as HTMLElement);
  }

  function handleMouseDone(e: MouseEvent) {
    e.stopPropagation();
    release();
  }

  function handleMouseDown(e: MouseEvent) {
    grab(e.clientY, this);
  }

  function grab(clientY: number, element: HTMLElement) {
    grabbed = element.parentElement;
    draggable.innerHTML = grabbed.innerHTML;
    position.offsetY = grabbed.getBoundingClientRect().y - clientY;
    drag(clientY);
  }

  function drag(clientY: number) {
    if (grabbed) {
      position.mouseY = clientY;
      position.draggableY = draggable.parentElement.getBoundingClientRect().y;
    }
  }

  function dragEnter(target: HTMLElement) {
    if (grabbed && target != grabbed) {
      moveDatum(
        parseInt(grabbed.dataset.index),
        parseInt(target.dataset.index)
      );
    }
  }

  function moveDatum(from: number, to: number) {
    const fromIndex = todos[from];
    const temp = [...todos.slice(0, from), ...todos.slice(from + 1)];
    todos = [...temp.slice(0, to), fromIndex, ...temp.slice(to)];
  }

  function release() {
    grabbed = null;
    draggable.innerHTML = null;

    // update locally stored todos
    state.setTodos(todos);
  }
</script>

<svelte:head>
  {#if $store.theme.file}
    <link href={`themes/${$store.theme.file}`} rel="stylesheet" />
  {/if}
</svelte:head>

<form on:submit|preventDefault={addTodo}>
  <button type="submit" tabindex="-1">
    <svg viewBox="0 0 24 24" width="20" height="20"
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
</form>

<ul
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseDone}
  on:mouseleave={handleMouseDone}
  class:list={todos.length > 0}
>
  <li
    bind:this={draggable}
    id="draggable"
    class={grabbed ? 'active' : ''}
    style={'top: ' +
      (position.mouseY + position.offsetY - position.draggableY) +
      'px'}
  />

  {#each todos as todo, index (todo.id)}
    <li
      in:fly={{ y: 4, duration: 150, easing: backOut }}
      out:fly={{ y: -2, duration: 150 }}
      id={grabbed && todo.id === grabbed.dataset.id ? 'grabbed' : ''}
      class="item"
      data-index={index}
      data-id={todo.id}
      on:mouseenter={handleMouseEnter}
    >
      <span
        style={grabbed ? 'cursor: grabbing' : ''}
        on:mousedown={handleMouseDown}
        ><svg
          class="grab"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
        >
          <path
            d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
          />
        </svg></span
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
    position: relative;
    text-align: center;
    width: 100%;
  }

  ul {
    width: 100%;
    position: relative;
  }

  li {
    user-select: none;
    position: relative;
  }

  span {
    -webkit-app-region: no-drag;
    cursor: grab;
    align-self: center;
    position: absolute;
    left: -18px;
    top: 50%;
    margin-top: -8px;
    height: -webkit-fill-available;
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

  svg.grab {
    width: 16px;
    opacity: 0;
    padding-right: 2px;
  }

  li:hover svg.grab {
    opacity: 0.3;
  }

  li:hover svg.grab:hover {
    opacity: 1;
  }

  svg {
    fill: var(--theme-secondary-color);
    opacity: 0.3;
  }

  #grabbed {
    opacity: 0;
  }

  #draggable {
    width: 100%;
    pointer-events: none;
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background: var(--theme-primary-color);
  }

  #draggable.active {
    z-index: 1;
    opacity: 0.7;
    box-shadow: 1px 1px 4px 0px rgb(0 0 0 / 20%);
  }
</style>
