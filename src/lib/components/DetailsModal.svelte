<script>
  import { onMount } from 'svelte';
  import Icon from 'svelte-awesome';
  import times from 'svelte-awesome/icons/times';

  let { item, onClose = () => {} } = $props();

  let dialogElement;
  let permissions = $state({
    loading: true,
    warnings: [],
    api: item.permissions || [],
    host: item.hostPermissions || [],
  });

  $effect(() => {
    let active = true;
    permissions.loading = true;

    async function fetchWarnings() {
      try {
        const warnings = await chrome.management.getPermissionWarningsById(item.id);
        if (active) {
          permissions.warnings = warnings;
        }
      } catch (e) {
        console.error('Could not fetch permission warnings:', e);
        if (active) permissions.warnings = ['Could not load warnings.'];
      } finally {
        if (active) permissions.loading = false;
      }
    }

    fetchWarnings();

    return () => {
      active = false;
    };
  });

  onMount(() => {
    dialogElement?.showModal();

    dialogElement?.addEventListener('close', onClose);

    return () => {
      dialogElement?.removeEventListener('close', onClose);
    };
  });
</script>

<dialog
  bind:this={dialogElement}
  onclick={(event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }}
>
  <div>
    <header>
      <h2>{item.name}</h2>
      <button class="close-button" onclick={onClose} title="Close (Esc)"
        ><Icon data={times} /></button
      >
    </header>

    <div class="content">
      <h3>Permission Warnings</h3>
      {#if permissions.loading}
        <p>Loading...</p>
      {:else if permissions.warnings.length > 0}
        <ul>
          {#each permissions.warnings as warning}
            <li>{warning}</li>
          {/each}
        </ul>
      {:else}
        <p class="empty-list">No special permission warnings.</p>
      {/if}

      <h3>Host Permissions (Websites)</h3>
      {#if permissions.host.length > 0}
        <ul>
          {#each permissions.host as host}
            <li>{host}</li>
          {/each}
        </ul>
      {:else}
        <p class="empty-list">No specific website access requested.</p>
      {/if}

      <h3>API Permissions</h3>
      {#if permissions.api.length > 0}
        <ul>
          {#each permissions.api as api}
            <li>{api}</li>
          {/each}
        </ul>
      {:else}
        <p class="empty-list">No browser API access requested.</p>
      {/if}
    </div>
  </div>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }

  dialog {
    background-color: var(--color-bg);
    color: var(--color-text);
    border: 1px solid var(--profiles-input-border);
    border-radius: 4px;
    padding: 0;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background-color: var(--h1-bg);
    background-image: var(--h1-bg-gradient);
    text-shadow: var(--h1-text-shadow);
    color: var(--h1-text);
    border-bottom: 1px solid var(--h1-bg);
  }

  h2 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.1em;
    cursor: pointer;
    color: inherit;
    opacity: 0.8;
  }

  .close-button:hover {
    opacity: 1;
  }

  .content {
    padding: 10px 15px;
    font-size: 12px;
  }

  h3 {
    font-size: 1em;
    font-weight: bold;
    margin: 15px 0 8px 0;
    border-bottom: 1px solid var(--options-legend-border);
    padding-bottom: 4px;
    color: var(--options-legend-text);
  }

  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
  }

  li {
    margin-bottom: 5px;
  }

  .empty-list {
    font-style: italic;
    color: var(--color-text-subtle);
    font-size: 12px;
  }
</style>
