<script lang="ts">
  import Modal from '@today/shared/components/Modal.svelte';
  import Cog from '@today/shared/components/Settings/Cog.svelte';
  import SettingsHeader from '@today/shared/components/Settings/SettingsModal/SettingsHeader.svelte';
  import SettingsContent from '@today/shared/components/Settings/SettingsModal/SettingsContent.svelte';

  let isOpen = false;

  function handleClick() {
    isOpen = !isOpen;
  }
</script>

<Cog {handleClick} />

<Modal {isOpen} close={() => (isOpen = false)}>
  <div slot="header">
    <SettingsHeader />
  </div>
  <div slot="content">
    <SettingsContent />
  </div>
</Modal>
