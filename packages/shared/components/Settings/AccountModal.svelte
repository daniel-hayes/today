<script lang="ts">
  import Hr from '../Hr.svelte';
  import Modal from '../Modal.svelte';
  import Login from './Login.svelte';
  import Signup from './Signup.svelte';
  import userStore from '../../store/user';
  import { logout } from '@today/shared/utils/firebase';

  enum ModalViewState {
    LOGIN,
    SIGNUP,
  }

  let isOpen = false;
  let view = ModalViewState.LOGIN;

  function toggleModal() {
    isOpen = !isOpen;
  }

  function toggleView(updatedView: ModalViewState) {
    switch (updatedView) {
      case ModalViewState.LOGIN:
        view = ModalViewState.LOGIN;
        break;
      case ModalViewState.SIGNUP:
        view = ModalViewState.SIGNUP;
        break;
      default:
        view = ModalViewState.LOGIN;
        break;
    }
  }
</script>

<Modal
  {isOpen}
  close={() => {
    isOpen = false;
    view = ModalViewState.LOGIN;
  }}
>
  <div slot="trigger">
    <button on:click={toggleModal}>Account</button>
  </div>

  <div slot="header">
    {#if $userStore.uid}
      Account
    {:else if view === ModalViewState.LOGIN}
      Login
    {:else}
      Sign Up
    {/if}
  </div>

  <div slot="content">
    {#if $userStore.uid}
      Cool
      <button on:click={logout}>log out</button>
    {:else if view === ModalViewState.LOGIN}
      <Login />
      <Hr />
      <button on:click={() => toggleView(ModalViewState.SIGNUP)}>Sign Up</button
      >
    {:else}
      <Signup />
    {/if}
  </div>
</Modal>

<style>
  :global(.form-field) {
    font-family: monospace;
    padding: 18px;
    border: none;
    border-radius: 0;
    background: #1e2145;
    color: #fff;
  }
  :global(.form-field:focus) {
    border-color: #5be2a9;
    box-shadow: 0 0 0 5px #5be2a9;
  }
  :global(.form-error) {
    font-family: monospace;
    color: #1e2145;
  }

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
  /* 
    footer {
      padding-bottom: 12px;
    } */
</style>
