<script lang="ts">
  import { Haptics, ImpactStyle } from '@capacitor/haptics';
  import { fly } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import uuid from '@today/shared/utils/uuid';
  import Todo from '@today/shared/components/Todo.svelte';
  import state from '@today/shared/store/state';
  import type { Todo as TodoType } from '@today/shared/store/state';
  import Settings from './Settings.svelte';
  import onInterval from '@today/shared/utils/onInterval';
  import {
    getColorsFromCSS,
    updateCSSVars,
    variants,
  } from '@today/shared/utils/themes';
  import { onMount } from 'svelte';
  import { trackEvent } from '@today/shared/utils/tracking';

  const hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

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
  });

  // Draggable functionality
  // @TODO clean this up. ideally add to it's own component
  let draggable: HTMLElement;
  let grabbed: HTMLElement;
  let position = {
    y: 0,
    offsetY: 0,
    draggableY: 0, // distance from top of list to top of client
  };

  function handleMouseMove(e: TouchEvent) {
    e.stopPropagation();

    const listContainer = e.currentTarget as HTMLElement;
    const firstListItem = listContainer.children[0];
    const lastListItem = listContainer.children[
      listContainer.children.length - 1
    ] as HTMLElement;
    let position = 0;

    // get the position of all list items to determine where "draggable" is relative to other items
    for (let i = 0; i < listContainer.children.length; i++) {
      const listItem = listContainer.children[i] as HTMLElement;
      const draggablePosition = draggable.getBoundingClientRect();
      const listItemPosition = listItem.getBoundingClientRect();

      // if you are between list items, get the index
      if (
        draggablePosition.y > listItemPosition.top &&
        draggablePosition.y < listItemPosition.bottom
      ) {
        position = parseInt(listItem.dataset.index);
      } else if (
        // if you are before the entire list, set it to the first position
        draggablePosition.y < firstListItem.getBoundingClientRect().top
      ) {
        position = 0;
      } else if (
        // if you are after the entire list, set it to the last position
        draggablePosition.y > lastListItem.getBoundingClientRect().bottom
      ) {
        position = parseInt(lastListItem.dataset.index);
      }
    }

    drag(e.touches[0].clientY);

    if (grabbed) {
      moveDatum(parseInt(grabbed.dataset.index), position);
    }
  }

  // @TODO clean this up
  var mouseIsDown = false;
  var idTimeout;

  function handleMouseDone(e: TouchEvent) {
    e.stopPropagation();

    clearTimeout(idTimeout);
    mouseIsDown = false;

    release();
  }

  function handleMouseDown(e: TouchEvent) {
    mouseIsDown = true;
    idTimeout = setTimeout(() => {
      if (mouseIsDown) {
        hapticsImpactLight();

        grab(e.touches[0].clientY, this);
      }
      // 500ms seems to be default haptic feedback duration on iOS
    }, 500);
  }

  function grab(clientY: number, element: HTMLElement) {
    grabbed = element;
    draggable.innerHTML = grabbed.innerHTML;
    position.offsetY = grabbed.getBoundingClientRect().y - clientY;

    // prevent DOM scrolling on the rest of the page
    document.body.style.overflow = 'hidden';

    drag(clientY);
  }

  function drag(clientY: number) {
    if (grabbed) {
      position.y = clientY;
      position.draggableY = draggable.parentElement.getBoundingClientRect().y;
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

    // allow DOM scrolling again
    document.body.style.overflow = 'auto';

    // update locally stored todos
    state.setTodos(todos);
  }
</script>

<svelte:head>
  {#if $store.theme.file}
    <link href={`themes/${$store.theme.file}`} rel="stylesheet" />
  {/if}
</svelte:head>

<Settings />

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
  on:touchmove={handleMouseMove}
  on:touchend={handleMouseDone}
  on:touchcancel={handleMouseDone}
  class:list={todos.length > 0}
>
  <li
    bind:this={draggable}
    id="draggable"
    class={grabbed ? 'active' : ''}
    style={'top: ' +
      (position.y + position.offsetY - position.draggableY) +
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
      on:touchstart={handleMouseDown}
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

<style>
  form {
    position: relative;
    text-align: center;
    width: 100%;
    margin-bottom: 10px;
  }

  ul {
    width: 100%;
    position: relative;
    margin-bottom: 12px;
  }

  li {
    user-select: none;
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

  form:focus-within {
    background: hsl(
      var(--theme-primary-color-h),
      var(--theme-primary-color-s),
      calc(var(--theme-primary-color-l) + 5%)
    );
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
