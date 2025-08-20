<script>
  import Icon from 'svelte-awesome';
  import exclamationTriangle from 'svelte-awesome/icons/exclamationTriangle';
  import arrowCircleRight from 'svelte-awesome/icons/arrowCircleRight';

  let {currentPage = 'options'} = $props();
</script>

<style>
  #header {
    margin-bottom: 1em;
  }

  #header h1 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  #header .tabs {
    float: left;
    width: 300px;
    max-width: 300px;
  }

  #header .help {
    float: right;
    padding: 20px;
    border-radius: 10px;
    line-height: 150%;
    width: 320px;
    max-width: 320px;
    background-color: var(--help-box-bg);
  }

  #header #menu {
    margin-left: 10px;
    padding-top: 20px;
    padding-bottom: 10px;
  }

  #header #menu a {
    cursor: pointer;
    font-weight: bold;
    font-size: 1em;
    color: #516C97;
    background-color: #fff;
    border: 1px solid #516C97;
    border-radius: 5px;
    padding: 5px 10px;
    text-decoration: none;
  }

  #header #menu a:hover {
    text-decoration: none;
  }

  #header #menu a.selected {
    background-color: #516C97;
    color: white;
  }

  :global(#header svg) {
    height: 1em;
    width: auto;
    display: inline-block;
    vertical-align: -0.125em;
  }
</style>

<section id="header">
  <div class="tabs">
    <h1><img alt="" src="/images/icon128.png" height="48" width="48"/> Extensity Options</h1>
    <div id="menu">
      <a class:selected={currentPage === 'options'} href="/options.html">Options</a>
      <a class:selected={currentPage === 'profiles'} href="/profiles.html">Profiles</a>
    </div>
  </div>
  <div class="help">
    <Icon data={exclamationTriangle}/>
    <strong>
      <a href="https://sergiokas.github.io/Extensity/help.html" target="_blank">Support
        Extensity!</a>
    </strong>
    <br/><br/>
    If you like Extensity and its new Profiles feature,

    <a
      href="https://sergiokas.github.io/Extensity/help.html"
      target="_blank"
    >
      please consider helping out with its development
      <Icon data={arrowCircleRight}/>
    </a>
  </div>
</section>

<div class="clear" style="clear: both;"></div>