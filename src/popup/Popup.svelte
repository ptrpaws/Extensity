<script>
  import {onMount} from 'svelte';
  import {extensions} from '../lib/stores/extensions.svelte.js';
  import {state as optionsState} from '../lib/stores/options.svelte.js';
  import {profiles} from '../lib/stores/profiles.svelte.js';
  import {sessionGet, sessionSet} from '../lib/stores/chrome.svelte.js';

  import Header from '../lib/components/Header.svelte';
  import ItemList from '../lib/components/ItemList.svelte';
  import ContentSection from '../lib/components/ContentSection.svelte';
  import ContextMenu from '../lib/components/ContextMenu.svelte';
  import DetailsModal from '../lib/components/DetailsModal.svelte';
  import Icon from 'svelte-awesome';
  import search from 'svelte-awesome/icons/search';
  import exclamationTriangle from 'svelte-awesome/icons/exclamationTriangle';
  import lightbulbO from 'svelte-awesome/icons/lightbulbO';
  import star from 'svelte-awesome/icons/star';
  import userCircleO from 'svelte-awesome/icons/userCircleO';
  import check from 'svelte-awesome/icons/check';

  let searchQuery = $state('');
  let activeProfileName = $state(null);

  let contextMenu = $state({
    visible: false,
    x: 0,
    y: 0,
    item: null
  });

  let detailsModal = $state({
    visible: false,
    item: null
  });

  onMount(async () => {
    const data = await sessionGet(['activeProfile']);
    activeProfileName = data.activeProfile || null;
  });

  function showContextMenu(event, item) {
    closeContextMenu();
    setTimeout(() => {
      contextMenu.visible = true;
      contextMenu.x = event.clientX;
      contextMenu.y = event.clientY;
      contextMenu.item = item;
    }, 10);
  }

  function closeContextMenu() {
    contextMenu.visible = false;
    contextMenu.item = null;
  }

  function openDetailsModal(item) {
    closeContextMenu();
    detailsModal.visible = true;
    detailsModal.item = item;
  }

  function closeDetailsModal() {
    detailsModal.visible = false;
    detailsModal.item = null;
  }

  const favoritesProfile = $derived(profiles.find('__favorites'));

  const listedProfiles = $derived(
    profiles.items.filter(p => {
      if (!p.isReserved) return true;
      return optionsState.showReserved && p.value.items.length > 0;
    })
  );

  const favoriteExtensions = $derived(
    favoritesProfile && favoritesProfile.value.items.length > 0
      ? extensions.extensions
        .filter((ext) => favoritesProfile.value.items.includes(ext.id))
        .filter((ext) => ext.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))
      : []
  );

  const filteredExtensions = $derived(
    extensions.extensions
      .filter((ext) => ext.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (optionsState.enabledFirst) {
          if (a.enabled !== b.enabled) {
            return a.enabled ? -1 : 1;
          }
        }
        return a.name.localeCompare(b.name);
      })
  );

  async function handleItemClick(item) {
    item.toggle();
    activeProfileName = null;
    await sessionSet({activeProfile: null});
  }

  async function applyProfile(profile) {
    const alwaysOnProfile = profiles.find('__always_on');
    const profileIds = new Set(profile.value.items);
    const alwaysOnIds = new Set(alwaysOnProfile ? alwaysOnProfile.value.items : []);

    const targetIds = new Set([...profileIds, ...alwaysOnIds]);

    extensions.disabled.forEach(ext => {
      if (targetIds.has(ext.id)) ext.toggle();
    });

    extensions.enabled.forEach(ext => {
      if (!targetIds.has(ext.id)) ext.toggle();
    });

    activeProfileName = profile.value.name;
    await sessionSet({activeProfile: profile.value.name});
  }
</script>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: Lucida Grande, Arial, sans-serif;
    font-size: 12px;
    min-height: fit-content;
    user-select: none;
    min-width: 280px;
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .popup-container {
    padding: 5px 7px 0 7px;
    position: relative;
  }

  #search {
    margin-top: 5px;
  }

  #content {
    margin-bottom: .5em;
  }

  #search p {
    margin: 0;
    padding: 1px 1px 1px 5px;
    border-radius: 3px 3px 0 0;
    display: flex;
    align-items: center;
    gap: 0.25em;
    background-image: var(--search-bg-gradient);
  }

  #search input {
    border: 0;
    border-radius: 3px;
    background: transparent;
    padding: 3px;
    outline: none;
    min-width: 200px;
    flex-grow: 1;
    color: var(--search-text);
  }

  .search-icon :global(svg) {
    color: var(--color-text-subtle);
    height: 1em;
    vertical-align: middle;
  }

  .profile-list-item {
    padding: 0;
  }

  .profile-list-item:hover {
    background-color: transparent;
    box-shadow: none;
  }

  .profile-button {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    margin: 0;
    padding: 3px 2px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  .profile-button:hover {
    background-color: var(--li-hover-bg);
    border-radius: 2px;
  }

  .profile-icon, .profile-check-icon {
    min-width: 15px;
    text-align: center;
    display: inline-block;
  }

  .profile-check-icon :global(svg) {
    color: green;
  }

  .empty {
    text-align: center;
    color: var(--color-text-subtle);
  }

  .empty :global(svg) {
    font-size: 2em;
    margin-bottom: 10px;
  }

  :global(#content svg) {
    height: 1em;
    width: auto;
    display: inline-block;
    vertical-align: -0.125em;
  }
</style>

<div class="popup-container">
  {#if optionsState.showHeader}
    <Header/>
  {/if}

  {#if optionsState.searchBox}
    <section id="search">
      <p>
        <span class="search-icon"><Icon data={search}/></span>
        <!-- svelte-ignore a11y_autofocus -->
        <input type="text" bind:value={searchQuery} placeholder="Search..." autofocus/>
      </p>
    </section>
  {/if}

  <section id="content">
    {#if listedProfiles.length > 0 && !searchQuery}
      <ContentSection title="Profiles">
        <ul>
          {#each listedProfiles as profile (profile.value.name)}
            <li class="profile-list-item">
              <button type="button" class="profile-button" onclick={() => applyProfile(profile)}>

                {#if profile.value.name === activeProfileName}
                  <span class="profile-check-icon">
                    <Icon data={check}/>
                  </span>
                {:else}
                  <span class="profile-icon">
                    {#if profile.value.name === '__always_on'}
                      <Icon data={lightbulbO}/>
                    {:else if profile.value.name === '__favorites'}
                      <Icon data={star}/>
                    {:else}
                      <Icon data={userCircleO}/>
                    {/if}
                  </span>
                {/if}

                <span>{profile.shortName}</span>
              </button>
            </li>
          {/each}
        </ul>
      </ContentSection>
    {/if}

    <ItemList
      title="Favorites"
      items={favoriteExtensions}
      {handleItemClick}
      oncontextmenu={showContextMenu}
    />

    <ItemList
      title="Extensions"
      items={filteredExtensions}
      {handleItemClick}
      oncontextmenu={showContextMenu}
    />

    {#if favoriteExtensions.length === 0 && filteredExtensions.length === 0}
      <p class="empty">
        <Icon data={exclamationTriangle}/>
        <br/>No items found.
      </p>
    {/if}
  </section>

  {#if contextMenu.visible}
    <ContextMenu
      item={contextMenu.item}
      x={contextMenu.x}
      y={contextMenu.y}
      onClose={closeContextMenu}
      onViewPermissions={() => openDetailsModal(contextMenu.item)}
    />
  {/if}

  {#if detailsModal.visible}
    <DetailsModal item={detailsModal.item} onClose={closeDetailsModal} />
  {/if}
</div>