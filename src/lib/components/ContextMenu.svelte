<script>
  import { onMount } from 'svelte';
  import Icon from 'svelte-awesome';
  import trash from 'svelte-awesome/icons/trash';
  import cog from 'svelte-awesome/icons/cog';
  import home from 'svelte-awesome/icons/home';
  import shoppingCart from 'svelte-awesome/icons/shoppingCart';
  import star from 'svelte-awesome/icons/star';
  import lightbulbO from 'svelte-awesome/icons/lightbulbO';
  import shield from 'svelte-awesome/icons/shield';
  import { profiles } from '../stores/profiles.svelte.js';

  let { item, x, y, onClose = () => {}, onViewPermissions = () => {} } = $props();

  const isFavorite = $derived(profiles.find('__favorites')?.value.items.includes(item.id));
  const isAlwaysOn = $derived(profiles.find('__always_on')?.value.items.includes(item.id));

  let menuElement;
  let finalX = $state(x);
  let finalY = $state(y);
  let isPositioned = $state(false);

  $effect(() => {
    if (!menuElement) return;

    isPositioned = false;

    const timer = setTimeout(() => {
      const menuRect = menuElement.getBoundingClientRect();
      const boundaryRect = document.body.getBoundingClientRect();

      let newX = x;
      if (x + menuRect.width > boundaryRect.width) {
        newX = boundaryRect.width - menuRect.width - 5;
      }
      finalX = Math.max(5, newX);

      let newY;
      const menuBottomEdge = y + menuRect.height;
      const boundaryBottomEdge = boundaryRect.height - 5;

      if (menuBottomEdge > boundaryBottomEdge) {
        newY = boundaryBottomEdge - menuRect.height;
      } else {
        newY = y;
      }
      finalY = Math.max(5, newY);

      isPositioned = true;
    }, 0);

    return () => clearTimeout(timer);
  });

  function toggleFavorite() {
    profiles.find('__favorites')?.toggleExtension(item.id);
    profiles.save();
    onClose();
  }

  function toggleAlwaysOn() {
    profiles.find('__always_on')?.toggleExtension(item.id);
    profiles.save();
    onClose();
  }

  async function handleUninstall() {
    await chrome.management.uninstall(item.id, { showConfirmDialog: true });
    onClose();
  }

  function handleOptions() {
    if (!item.optionsUrl) return;
    chrome.tabs.create({ url: item.optionsUrl });
    onClose();
  }

  function handleHomepage() {
    if (!item.homepageUrl) return;
    chrome.tabs.create({ url: item.homepageUrl });
    onClose();
  }

  function handleWebView() {
    const webstoreUrl = `https://chrome.google.com/webstore/detail/${item.id}`;
    chrome.tabs.create({ url: webstoreUrl });
    onClose();
  }

  onMount(() => {
    menuElement?.focus();

    function handleClickAway() {
      onClose();
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    setTimeout(() => {
      window.addEventListener('click', handleClickAway);
      window.addEventListener('keydown', handleKeydown);
    }, 0);

    return () => {
      window.removeEventListener('click', handleClickAway);
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div
  class="context-menu"
  class:positioned={isPositioned}
  role="menu"
  tabindex="-1"
  bind:this={menuElement}
  style="left: {finalX}px; top: {finalY}px;"
  onclick={(event) => event.stopPropagation()}
  onkeydown={() => {}}
>
  <ul>
    <li>
      <button type="button" class="menu-button" onclick={toggleFavorite}>
        <span class="icon"><Icon data={star} /></span>
        {#if isFavorite}Remove from Favorites{:else}Add to Favorites{/if}
      </button>
    </li>

    <li>
      <button type="button" class="menu-button" onclick={toggleAlwaysOn}>
        <span class="icon"><Icon data={lightbulbO} /></span>
        {#if isAlwaysOn}Remove from Always On{:else}Add to Always On{/if}
      </button>
    </li>

    <li class="separator"></li>

    <li>
      <button type="button" class="menu-button" onclick={onViewPermissions}>
        <span class="icon"><Icon data={shield} /></span> View Permissions
      </button>
    </li>

    {#if item.optionsUrl}
      <li>
        <button
          type="button"
          class="menu-button"
          disabled={!item.enabled}
          onclick={handleOptions}
          title={item.enabled ? item.optionsUrl : 'Enable the extension to view options'}
        >
          <span class="icon"><Icon data={cog} /></span> Options
        </button>
      </li>
    {/if}

    {#if item.homepageUrl}
      <li>
        <button type="button" class="menu-button" onclick={handleHomepage} title={item.homepageUrl}>
          <span class="icon"><Icon data={home} /></span> Homepage
        </button>
      </li>
    {/if}

    <li class="separator"></li>

    <li>
      <button type="button" class="menu-button" onclick={handleWebView}>
        <span class="icon"><Icon data={shoppingCart} /></span> View on Web Store
      </button>
    </li>

    {#if item.mayDisable}
      <li>
        <button type="button" class="menu-button" onclick={handleUninstall}>
          <span class="icon"><Icon data={trash} /></span> Uninstall...
        </button>
      </li>
    {/if}
  </ul>
</div>

<style>
  .context-menu {
    position: absolute;
    z-index: 1000;
    background-color: var(--color-bg);
    border: 1px solid var(--profiles-input-border);
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    min-width: 200px;
    padding: 2px 0;
    outline: none;

    visibility: hidden;
    opacity: 0;
    transition: opacity 0.075s ease-in-out;
  }

  .context-menu.positioned {
    visibility: visible;
    opacity: 1;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 0;
    margin: 0;
    display: block;
  }

  .menu-button {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    font-size: 12px;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 3px 10px;
    cursor: pointer;
    text-align: left;
    border-radius: 2px;
  }

  .menu-button:hover,
  .menu-button:focus {
    background-color: var(--li-hover-bg);
    text-shadow: var(--li-hover-text-shadow);
    outline: none;
  }

  .menu-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
    text-shadow: none;
  }

  li.separator {
    height: 0;
    border-top: 1px solid var(--profiles-input-border);
    margin: 2px 0;
  }

  .icon {
    width: 1.2em;
    text-align: center;
    color: var(--color-text-subtle);
  }

  .menu-button:hover .icon,
  .menu-button:focus .icon {
    filter: drop-shadow(0 1px 0px white);
  }

  @media (prefers-color-scheme: dark) {
    .menu-button:hover .icon,
    .menu-button:focus .icon {
      filter: drop-shadow(0 1px 0px black);
    }
  }

  .menu-button:disabled:hover .icon {
    filter: none;
  }
</style>
