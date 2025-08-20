<script>
  import Icon from 'svelte-awesome';
  import plusCircle from 'svelte-awesome/icons/plusCircle';
  import lightbulbO from 'svelte-awesome/icons/lightbulbO';
  import star from 'svelte-awesome/icons/star';
  import trashO from 'svelte-awesome/icons/trashO';

  let {
    profiles = [],
    currentProfile = null,
    onAdd = () => {},
    onRemove = () => {},
    onSelect = () => {},
  } = $props();

  let newProfileName = $state('');

  function handleAddProfile(event) {
    event.preventDefault();
    const name = newProfileName.trim();
    if (name === '') return;
    onAdd(name);
    newProfileName = '';
  }
</script>

<style>
  .sidebar {
    float: left;
    width: 200px;
    max-width: 200px;
  }

  ul {
    padding-left: 0;
    list-style-type: none;
    margin: 1em 0;
  }

  .sidebar ul.items li {
    margin: 10px 0;
    display: flex;
    align-items: center;

    border-radius: 0;

    padding: 0 10px;
    gap: 0.5em;
  }

  .sidebar ul.items li.active {
    background-color: var(--profiles-active-bg);
  }

  form {
    display: flex;
    margin: 7px 0 10px 0;
  }

  input#name {
    padding: 5px;
    outline: none;
    border-width: 1px;
    border-style: solid;
    border-right: none;
    border-radius: 5px 0 0 5px;
    font-size: 1.05em;
    background-color: var(--input-bg);
    color: var(--input-text);
    border-color: var(--input-border);
  }

  button.add {
    padding: 5px 8px;
    font-weight: normal;
    border-radius: 0 5px 5px 0;
    border-width: 1px;
    border-style: solid;
    border-color: var(--input-border);
  }

  .select-button, .remove-button {
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    padding: 7px 0;
  }

  .select-button {
    flex-grow: 1;
    width: 100%;
  }

  .remove-button {
    flex-shrink: 0;
  }

  .profile-icon {
    padding: 7px 0;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    width: 1em;
    justify-content: center;
  }

</style>

<div class="sidebar">
  <form onsubmit={handleAddProfile}>
    <input
      bind:value={newProfileName}
      id="name"
      placeholder="New Profile Name"
      type="text"
    />
    <button aria-label="Add new profile" class="add" type="submit">
      <Icon data={plusCircle}/>
    </button>
  </form>

  <ul class="items">
    {#each profiles as profile (profile.value.name)}
      <li class:active={currentProfile?.value.name === profile.value.name}>

        {#if !profile.isReserved}
          <button
            type="button"
            class="remove-button"
            aria-label="Remove profile {profile.shortName}"
            onclick={() => onRemove(profile)}
          >
            <Icon data={trashO}/>
          </button>
        {:else if profile.value.name === '__always_on'}
          <span class="profile-icon"><Icon data={lightbulbO}/></span>
        {:else if profile.value.name === '__favorites'}
          <span class="profile-icon"><Icon data={star}/></span>
        {/if}

        <button
          type="button"
          class="select-button"
          onclick={() => onSelect(profile)}
        >
          {profile.shortName}
        </button>
      </li>
    {/each}
  </ul>
</div>