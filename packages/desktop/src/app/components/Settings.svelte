<script lang="ts">
  import SettingsHeader from '@today/shared/components/Settings/SettingsModal/SettingsHeader.svelte';
  import SettingsContent from '@today/shared/components/Settings/SettingsModal/SettingsContent.svelte';
  import Modal from '@today/shared/components/Modal.svelte';
  import bridge, { Action, Channel } from '../bridge';

  let isOpen = false;

  bridge(Channel.SHORTCUT, (action: Action) => {
    if (action === Action.SETTINGS) {
      isOpen = !isOpen;
    }
  });
</script>

<Modal {isOpen} close={() => (isOpen = false)}>
  <div slot="header">
    <SettingsHeader />
  </div>
  <div slot="content">
    <SettingsContent />
  </div>
</Modal>
