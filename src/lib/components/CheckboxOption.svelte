<script>
  let {checked = $bindable(), id, children} = $props();
</script>

<style>
  .field {
    float: left;
    clear: left;
    margin: .8em 0;
  }
</style>

<div class="field">
  <input bind:checked={checked} {id} type="checkbox"/>
  <label for={id}>{@render children()}</label>
</div>