import {getAllExtensions} from './chrome.svelte.js';

function createExtensionsStore() {
  let all = $state([]);

  (async () => {
    try {
      const results = await getAllExtensions();
      all = results
        .filter((ext) => ext.name !== 'Extensity' && ext.type !== 'theme')
        .map((ext) => {
          const reactiveExt = $state({
            ...ext,
            get icon() {
              if (!ext.icons || ext.icons.length === 0) return '/images/icon48.png';
              const bestIcon = ext.icons.reduce((prev, curr) => {
                return Math.abs(curr.size - 16) < Math.abs(prev.size - 16) ? curr : prev;
              });
              return bestIcon?.url || '/images/icon48.png';
            },
            toggle() {
              const newState = !reactiveExt.enabled;
              chrome.management.setEnabled(ext.id, newState, () => {
                if (chrome.runtime.lastError) {
                  console.error(chrome.runtime.lastError);
                } else {
                  reactiveExt.enabled = newState;
                }
              });
            },
          });
          return reactiveExt;
        })
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
    } catch (e) {
      console.error("Failed to load extensions:", e);
    }
  })();

  const extensions = $derived(all.filter((item) => item.type === 'extension' && item.mayDisable));
  const apps = $derived(all.filter((item) => ['hosted_app', 'packaged_app'].includes(item.type)));

  const enabled = $derived(extensions.filter((item) => item.enabled));
  const disabled = $derived(extensions.filter((item) => !item.enabled));

  return {
    get all() {
      return all;
    },
    get extensions() {
      return extensions;
    },
    get apps() {
      return apps;
    },
    get enabled() {
      return enabled;
    },
    get disabled() {
      return disabled;
    },
    find: (id) => all.find((ext) => ext.id === id),
  };
}

export const extensions = createExtensionsStore();