import { mount } from 'svelte';
import Profiles from './Profiles.svelte';
import '../styles/theme.css';
import '../styles/global.css';

mount(Profiles, {
  target: document.getElementById('app'),
});
