<script>
  import { state as optionsState } from '../stores/options.svelte.js';
  import Icon from 'svelte-awesome';
  import flask from 'svelte-awesome/icons/flask';
  import cog from 'svelte-awesome/icons/cog';
  import refresh from 'svelte-awesome/icons/refresh';
  import { prune } from '../utils.js';

  let { item, onclick = () => {}, oncontextmenu = () => {} } = $props();

  function launchOptions(event) {
    event.stopPropagation();
    chrome.tabs.create({ url: item.optionsUrl });
  }

  async function reloadExtension(event) {
    event.stopPropagation();
    if (item.installType !== 'development' || !item.enabled) return;
    try {
      await chrome.management.setEnabled(item.id, false);
      await chrome.management.setEnabled(item.id, true);
    } catch (e) {
      console.error(`Failed to reload extension ${item.id}:`, e);
    }
  }
</script>

<li
  oncontextmenu={(event) => {
    event.preventDefault();
    oncontextmenu(event);
  }}
  class:disabled={!item.enabled && item.type === 'extension'}
>
  <button class="main-action" {onclick} type="button">
    <img alt="" height="16" src={item.icon} width="16" />
    <span class="name">{prune(item.name, 40)}</span>

    {#if item.installType === 'development'}
      <span class="dev-icon" title="Development"><Icon data={flask} /></span>
    {/if}
  </button>

  {#if item.installType === 'development' && item.enabled}
    <button
      type="button"
      class="action-button"
      title="Reload extension"
      aria-label="Reload {item.name}"
      onclick={reloadExtension}
    >
      <Icon data={refresh} />
    </button>
  {/if}

  {#if optionsState.showOptions && item.optionsUrl && item.enabled}
    <button
      type="button"
      class="action-button"
      title="Options"
      aria-label="Options for {item.name}"
      onclick={launchOptions}
    >
      <Icon data={cog} />
    </button>
  {/if}
</li>

<style>
  li {
    padding: 3px 2px;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  li:hover {
    border-radius: 2px;
  }

  li:hover .main-action {
    text-shadow: var(--li-hover-text-shadow);
  }

  li:hover .action-button :global(svg) {
    filter: drop-shadow(0 1px 0px white);
  }

  @media (prefers-color-scheme: dark) {
    li:hover .action-button :global(svg) {
      filter: drop-shadow(0 1px 0px black);
    }
  }

  li img {
    vertical-align: middle;
    margin-top: -2px;
    image-rendering: crisp-edges;
  }

  li.disabled {
    opacity: 0.7;
  }

  li.disabled img {
    opacity: 0.3;
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .main-action {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    cursor: pointer;
    text-align: left;
    flex-grow: 1;
    display: flex;
    align-items: center;
    gap: 0.5em;
    min-width: 0;
  }

  .action-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 1.1em;
    color: #777;
    line-height: 1;
    transition: color 0.1s ease-in-out;
  }

  .action-button:hover {
    color: #333;
  }

  @media (prefers-color-scheme: dark) {
    .action-button:hover {
      color: #eee;
    }
  }

  .dev-icon :global(svg) {
    color: #777;
  }

  :global(li svg) {
    height: 1em;
    width: auto;
    display: inline-block;
    vertical-align: -0.125em;
  }
</style>
