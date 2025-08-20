<script>
  let { title, children } = $props();
</script>

<section>
  {#if title}
    <h1>{title}</h1>
  {/if}
  {@render children()}
</section>

<style>
  h1 {
    padding: 3px 4px;
    margin: 0;
    border-radius: 2px;
    font-size: 1em;
    background-color: var(--h1-bg);
    background-image: var(--h1-bg-gradient);
    text-shadow: var(--h1-text-shadow);
    color: var(--h1-text);
  }

  :global(section > ul) {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  :global(section > ul > li) {
    cursor: pointer;
  }

  :global(section > ul > li:hover) {
    border-radius: 2px;
    text-shadow: var(--li-hover-text-shadow);
    background-color: var(--li-hover-bg);
    box-shadow: var(--li-hover-shadow);
  }
</style>
