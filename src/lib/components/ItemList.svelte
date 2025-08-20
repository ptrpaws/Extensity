<script>
  import Item from './Item.svelte';
  import ContentSection from './ContentSection.svelte';

  let { title, items, handleItemClick, oncontextmenu = () => {} } = $props();
</script>

{#if items.length > 0}
  <ContentSection {title}>
    <ul>
      {#each items as item (item.id)}
        <Item
          {item}
          onclick={() => handleItemClick(item)}
          oncontextmenu={(event) => oncontextmenu(event, item)}
        />
      {/each}
    </ul>
  </ContentSection>
{/if}
