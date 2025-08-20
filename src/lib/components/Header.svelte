<script>
  import { extensions } from '../stores/extensions.svelte.js';
  import { state as optionsState } from '../stores/options.svelte.js';
  import { profiles } from '../stores/profiles.svelte.js';
  import Icon from 'svelte-awesome';
  import cog from 'svelte-awesome/icons/cog';
  import userCircleO from 'svelte-awesome/icons/userCircleO';
  import puzzlePiece from 'svelte-awesome/icons/puzzlePiece';
  import toggleOn from 'svelte-awesome/icons/toggleOn';
  import toggleOff from 'svelte-awesome/icons/toggleOff';
  import twitter from 'svelte-awesome/icons/twitter';
  import facebookOfficial from 'svelte-awesome/icons/facebookOfficial';
  import star from 'svelte-awesome/icons/star';

  let allToggledOff = $state(false);
  let toggledIds = $state([]);

  function flipAll() {
    if (allToggledOff) {
      toggledIds.forEach((id) => {
        const ext = extensions.find(id);
        if (ext && !ext.enabled) ext.toggle();
      });
      toggledIds = [];
      allToggledOff = false;
    } else {
      const alwaysOnProfile = profiles.find('__always_on');
      const alwaysOnIds = new Set(alwaysOnProfile ? alwaysOnProfile.value.items : []);

      const toDisable = extensions.enabled.filter((ext) => {
        return !(optionsState.keepAlwaysOn && alwaysOnIds.has(ext.id));
      });

      toggledIds = toDisable.map((ext) => ext.id);
      toDisable.forEach((ext) => ext.toggle());
      allToggledOff = true;
    }
  }

  const toggleIcon = $derived(allToggledOff ? toggleOff : toggleOn);

  function openExtensionsPage(event) {
    event.preventDefault();
    chrome.tabs.create({ url: 'chrome://extensions' });
  }
</script>

<section id="header">
  <h1>
    <a
      href="https://chrome.google.com/webstore/detail/jjmflmamggggndanpgfnpelongoepncg"
      id="title"
      target="_blank"
    >
      <img alt="" height="16" src="/images/icon128.png" width="16" />&nbsp;Extensity
    </a>
    <div class="actions-group">
      {#if optionsState.showHeaderActions}
        <button
          aria-label="Switch all extensions off/on"
          class="switch"
          class:toggled-off={allToggledOff}
          onclick={flipAll}
          title="Switch all extensions off/on"
          type="button"
        >
          <Icon data={toggleIcon} />
        </button>
        <a
          aria-label="Chrome Extensions"
          class="page"
          href="chrome://extensions"
          onclick={openExtensionsPage}
          target="_blank"
          title="Chrome Extensions"
        >
          <Icon data={puzzlePiece} />
        </a>
        <a aria-label="Profiles" class="page" href="profiles.html" target="_blank" title="Profiles">
          <Icon data={userCircleO} />
        </a>
        <a
          aria-label="Extensity options"
          class="page"
          href="options.html"
          target="_blank"
          title="Extensity options"
        >
          <Icon data={cog} />
        </a>
      {/if}

      {#if optionsState.showHeaderSocial}
        <a
          href="https://twitter.com/share?url=https://chrome.google.com/webstore/detail/jjmflmamggggndanpgfnpelongoepncg&via=ExtensityChrome&text=Keep control of your Chrome extensions with Extensity. Quickly enable/disable any extension!"
          class="page twitter-icon"
          target="_blank"
          title="Share Extensity on Twitter. Thanks!"
        >
          <Icon data={twitter} />
        </a>
        <a
          href="https://www.facebook.com/sharer/sharer.php?u=https%3A//chrome.google.com/webstore/detail/extensity/jjmflmamggggndanpgfnpelongoepncg?hl=en"
          class="page facebook-icon"
          target="_blank"
          title="Share Extensity on Facebook. Thanks!"
        >
          <Icon data={facebookOfficial} />
        </a>
        <a
          href="https://chrome.google.com/webstore/detail/extensity/jjmflmamggggndanpgfnpelongoepncg/reviews"
          class="page star-icon"
          target="_blank"
          title="Rate Extensity. Thanks!"
        >
          <Icon data={star} />
        </a>
      {/if}
    </div>
  </h1>
</section>

<style>
  section {
    width: 100%;
  }

  h1 {
    font-size: 1em;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
  }

  #title {
    font-weight: bold;
    font-size: 1.15em;
    text-decoration: none;
    color: var(--header-title);
    display: flex;
    align-items: center;
  }

  #title img {
    max-width: 16px;
    max-height: 16px;
  }

  .actions-group {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .page,
  .switch {
    font-size: 1.4em;
    cursor: pointer;
    outline: none;
    display: flex;
    align-items: center;
  }

  .switch {
    background: none;
    border: none;
    padding: 0;
  }

  .page :global(svg),
  .switch :global(svg) {
    color: var(--header-icon);
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .page:hover :global(svg) {
    opacity: 1;
  }

  .switch.toggled-off :global(svg) {
    color: var(--header-icon-off);
  }

  a.star-icon :global(svg) {
    color: #ff9300;
  }

  a.facebook-icon :global(svg) {
    color: #3b5998;
  }

  a.twitter-icon :global(svg) {
    color: #55a4da;
  }

  :global(#header svg) {
    height: 1em;
    width: auto;
    display: inline-block;
    vertical-align: -0.125em;
  }
</style>
