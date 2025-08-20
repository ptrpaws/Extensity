import {mount} from 'svelte';
import Popup from './Popup.svelte';
import 'normalize.css';
import '../styles/theme.css';
import '../styles/global.css';

mount(Popup, {
  target: document.getElementById('app'),
});