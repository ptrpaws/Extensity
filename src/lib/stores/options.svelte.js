import { storageGet, storageSet } from './chrome.svelte.js';

const DEFAULTS = {
  showHeader: true,
  showHeaderSocial: false,
  showHeaderActions: true,
  enabledFirst: true,
  searchBox: true,
  showOptions: true,
  keepAlwaysOn: true,
  showReserved: false,
};

export const state = $state({ ...DEFAULTS });

export async function save() {
  const dataToSave = { ...state };
  await storageSet(dataToSave);
}

(async () => {
  try {
    const storedOptions = await storageGet(Object.keys(DEFAULTS));
    if (storedOptions && Object.keys(storedOptions).length > 0) {
      Object.assign(state, storedOptions);
    }
  } catch (e) {
    console.error('Failed to load options:', e);
  }
})();
