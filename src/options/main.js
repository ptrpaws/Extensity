import { mount } from 'svelte';
import Options from './Options.svelte';
import '../styles/theme.css';
import '../styles/global.css';

mount(Options, {
  target: document.getElementById('app'),
});
