<script>
  import {state as optionsState} from '../stores/options.svelte.js';
  import Icon from 'svelte-awesome';
  import flask from 'svelte-awesome/icons/flask';
  import cog from 'svelte-awesome/icons/cog';
  import {prune} from '../utils.js';

  let {item, onclick = () => {}} = $props();

  function launchOptions(event) {
    event.stopPropagation();
    chrome.tabs.create({url: item.optionsUrl});
  }
</script>

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

  li img {
    vertical-align: middle;
    margin-top: -2px;
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

  .options-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0 0 0 auto;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 1.1em;
    color: #777;
    line-height: 1;
  }

  .options-button:hover {
    color: #333;
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

<li class:disabled={!item.enabled && item.type === 'extension'}>
  <button class="main-action" {onclick} type="button">
    <img alt="" height="16" src={item.icon} width="16"/>
    <span class="name">{prune(item.name, 40)}</span>

    {#if item.installType === 'development'}
      <span class="dev-icon" title="Development"><Icon data={flask}/></span>
    {/if}
  </button>

  {#if optionsState.showOptions && item.optionsUrl && item.enabled}
    <button
      type="button"
      class="options-button"
      title="Options"
      aria-label="Options for {item.name}"
      onclick={launchOptions}
    >
      <Icon data={cog}/>
    </button>
  {/if}
</li>