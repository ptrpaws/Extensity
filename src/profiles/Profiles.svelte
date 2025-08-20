<script>
  import { profiles } from '../lib/stores/profiles.svelte.js';
  import OptionsHeader from '../lib/components/OptionsHeader.svelte';
  import ProfileSidebar from '../lib/components/ProfileSidebar.svelte';
  import ExtensionChecklist from '../lib/components/ExtensionChecklist.svelte';
  import Icon from 'svelte-awesome';
  import exclamationTriangle from 'svelte-awesome/icons/exclamationTriangle';
  import infoCircle from 'svelte-awesome/icons/infoCircle';
  import lightbulbO from 'svelte-awesome/icons/lightbulbO';
  import star from 'svelte-awesome/icons/star';

  let currentProfile = $state(null);
  let saveMessageVisible = $state(false);

  function handleAddProfile(name) {
    const added = profiles.add(name);
    if (added) {
      currentProfile = added;
    }
  }

  function handleRemoveProfile(profileToRemove) {
    if (confirm(`Are you sure you want to remove the profile "${profileToRemove.shortName}"?`)) {
      const isCurrent = currentProfile?.value.name === profileToRemove.value.name;
      profiles.remove(profileToRemove);
      if (isCurrent) {
        currentProfile = null;
      }
    }
  }

  async function saveProfiles() {
    await profiles.save();
    saveMessageVisible = true;
    setTimeout(() => {
      saveMessageVisible = false;
    }, 2000);
  }

  function closeWindow() {
    window.close();
  }
</script>

<OptionsHeader currentPage="profiles" />

<div id="content">
  <div class="instructions">
    <p class="info">
      <Icon data={infoCircle} />
      <span>
        <strong> How Profiles Work:</strong>
        <br /><br />When activating a profile,
        <strong>selected extensions will be enabled, and all the rest will be disabled.</strong>
        <br /><br />You can create as many profiles as you want. Try to put descriptive names such
        as "Browsing", "Shopping", "Work", etc. <br /><br /><Icon data={lightbulbO} />
        <strong>Always On</strong>: Extensions that should be always enabled when switching to
        different profiles. You can still manually disable each extension when needed.
        <br /><br /><Icon data={star} />
        <strong>Favorites</strong>: Frequently used Extensions that will show up at the top of the
        list.
      </span>
    </p>
  </div>

  <fieldset id="profiles">
    <div class="left-column">
      <ProfileSidebar
        profiles={profiles.items}
        {currentProfile}
        onAdd={handleAddProfile}
        onRemove={handleRemoveProfile}
        onSelect={(profile) => (currentProfile = profile)}
      />
      <div class="save-area">
        <hr />
        <p>
          <small
            ><em>Note: no changes will be applied until you click on the "Save" button.</em></small
          >
        </p>
        <button id="save" onclick={saveProfiles}>Save</button>&nbsp;
        <button type="button" class="link-button" id="close" onclick={closeWindow}>Close</button>
        {#if saveMessageVisible}
          <span id="save-result" class:visible={saveMessageVisible}>| Saved!</span>
        {/if}
        {#if profiles.localProfiles}
          <p class="quota-error">
            <Icon data={exclamationTriangle} />
            Sync quota exceeded.
            <b>Your Profiles are saved on this browser only</b>.
          </p>
        {/if}
      </div>
    </div>

    <ExtensionChecklist {currentProfile} />
  </fieldset>
</div>

<style>
  .instructions {
    float: right;
  }

  .info {
    padding: 20px;
    border-radius: 10px;
    line-height: 150%;
    width: 320px;
    max-width: 320px;
    background-color: var(--profiles-info-bg);
  }

  fieldset {
    float: left;
    border: none;
    margin-top: 0.5em;
    padding: 0;
    margin-left: 10px;
  }

  .left-column {
    float: left;
    width: 200px;
    max-width: 200px;
  }

  .save-area {
    padding-top: 1rem;
  }

  .quota-error {
    background-color: #ffeeee;
    border: 1px solid red;
    border-radius: 5px;
    padding: 8px;
    margin-top: 1em;
  }

  hr {
    border: 0;
    height: 1px;
    background-color: var(--profiles-input-border);
    margin: 1em 0;
  }

  :global(#content svg) {
    height: 1em;
    width: auto;
    display: inline-block;
    vertical-align: -0.125em;
  }
</style>
