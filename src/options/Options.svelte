<script>
  import { state as optionsState, save as saveOptions } from '../lib/stores/options.svelte.js';
  import OptionsHeader from '../lib/components/OptionsHeader.svelte';
  import CheckboxOption from '../lib/components/CheckboxOption.svelte';

  let saveMessageVisible = $state(false);

  async function handleSave() {
    await saveOptions();
    saveMessageVisible = true;
    setTimeout(() => {
      saveMessageVisible = false;
    }, 2000);
  }

  function closeWindow() {
    window.close();
  }
</script>

<OptionsHeader currentPage="options" />

<section id="content">
  <fieldset id="options">
    <legend>Header</legend>
    <CheckboxOption bind:checked={optionsState.showHeader} id="showHeader">
      Show header at the top
    </CheckboxOption>
    <CheckboxOption bind:checked={optionsState.showHeaderActions} id="showHeaderActions">
      Show action icons (Toggle All, etc.)
    </CheckboxOption>
    <CheckboxOption bind:checked={optionsState.showHeaderSocial} id="showHeaderSocial">
      Show social & rating icons
    </CheckboxOption>
    <CheckboxOption bind:checked={optionsState.searchBox} id="searchBox">
      Show search box
    </CheckboxOption>

    <legend>Extensions</legend>
    <CheckboxOption bind:checked={optionsState.enabledFirst} id="enabledFirst">
      Show enabled Extensions at the top
    </CheckboxOption>
    <CheckboxOption bind:checked={optionsState.showOptions} id="showOptions">
      Show options icon for each item
    </CheckboxOption>

    <legend>Profiles &amp; Lists</legend>
    <CheckboxOption bind:checked={optionsState.showReserved} id="showReserved">
      Show "Favorites" and "Always On" profiles in the list
    </CheckboxOption>
    <CheckboxOption bind:checked={optionsState.keepAlwaysOn} id="keepAlwaysOn">
      Keep "Always On" extensions enabled when switching everything off
    </CheckboxOption>

    <div class="form-actions">
      <button id="save" onclick={handleSave}>Save</button>&nbsp;
      <button type="button" class="link-button" id="close" onclick={closeWindow}>Close</button>
      {#if saveMessageVisible}
        <span id="save-result" class:visible={saveMessageVisible}>| Saved!</span>
      {/if}
    </div>
  </fieldset>
</section>

<style>
  .form-actions {
    clear: both;
    padding-top: 1.5em;
  }

  #save-result {
    transition:
      visibility 0s 0.5s,
      opacity 0.5s linear;
  }
</style>
