<script>
  import Item from './Item.svelte';
  import ContentSection from './ContentSection.svelte';

  let {title, items, handleItemClick} = $props();
</script>
{#if items.length > 0}
  <ContentSection {title}>
    <ul>
      {#each items as item (item.id)}
        <Item {item} onclick={() => handleItemClick(item)}/>
      {/each}
    </ul>
  </ContentSection>
{/if}