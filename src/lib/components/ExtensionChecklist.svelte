<script>
  import { extensions } from '../stores/extensions.svelte.js';
  import { prune } from '../utils.js';
  import Icon from 'svelte-awesome';
  import flask from 'svelte-awesome/icons/flask';

  let { currentProfile } = $props();

  function toggleAllInProfile() {
    if (!currentProfile) return;
    currentProfile.value.items = extensions.extensions.map((ext) => ext.id);
  }
  function toggleNoneInProfile() {
    if (!currentProfile) return;
    currentProfile.value.items = [];
  }

  const extensionInProfileMap = $derived.by(() => {
    const map = new Map();
    if (currentProfile) {
      for (const extId of currentProfile.value.items) {
        map.set(extId, true);
      }
    }
    return map;
  });
</script>

{#if currentProfile}
  <div class="extensions">
    <p class="toggle">
      <button type="button" class="link-button" onclick={toggleAllInProfile}>All</button>
      |
      <button type="button" class="link-button" onclick={toggleNoneInProfile}>None</button>
    </p>
    <ul>
      {#each extensions.extensions as ext (ext.id)}
        <li>
          <label for={ext.id}>
            <input
              type="checkbox"
              id={ext.id}
              checked={extensionInProfileMap.has(ext.id)}
              onchange={() => currentProfile.toggleExtension(ext.id)}
            />
            <img src={ext.icon} width="16" height="16" alt="" />
            <span>{prune(ext.name, 40)}</span>
            {#if ext.installType === 'development'}
              <Icon data={flask} title="Development" />
            {/if}
          </label>
        </li>
      {/each}
    </ul>
  </div>
{/if}

<style>
  .extensions {
    float: left;
    border-left: 1px solid #ddd;
    padding-left: 10px;
    padding-right: 10px;
  }

  ul {
    padding-left: 0;
    list-style-type: none;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    line-height: 200%;
    width: 100%;
  }

  .toggle {
    margin: 0 -10px;
    padding: 10px;
    background-color: var(--profiles-toggle-bg);
  }

  .link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
</style>
