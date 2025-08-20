<script>
  let { checked = $bindable(), id, children } = $props();
</script>

<div class="field">
  <input bind:checked {id} type="checkbox" />
  <label for={id}>{@render children()}</label>
</div>

<style>
  .field {
    float: left;
    clear: left;
    margin: 0.8em 0;
  }
</style>
