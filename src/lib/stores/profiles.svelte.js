import {storageGet, storageSet} from './chrome.svelte.js';

function createProfile(name, items = []) {
  const profile = $state({name, items});

  return {
    get value() {
      return profile;
    },
    get isReserved() {
      return profile.name.startsWith('__');
    },
    get shortName() {
      const reserved_names = {"__always_on": "Always On", "__favorites": "Favorites"};
      return reserved_names[profile.name] || profile.name;
    },
    toggleExtension(extId) {
      const index = profile.items.indexOf(extId);
      if (index > -1) {
        profile.items = profile.items.filter(id => id !== extId);
      } else {
        profile.items = [...profile.items, extId];
      }
    }
  };
}

function createProfilesStore() {
  let items = $state([]);
  let localProfiles = $state(false);

  (async () => {
    try {
      const v = await storageGet("localProfiles");
      const useLocal = v.localProfiles || false;
      const storageArea = useLocal ? chrome.storage.local : chrome.storage.sync;
      localProfiles = useLocal;

      const p = await new Promise(resolve => storageArea.get("profiles", resolve));

      const profilesData = p['profiles'] || {};
      let loadedProfiles = Object.keys(profilesData).map(name => createProfile(name, profilesData[name]));

      if (!loadedProfiles.find(p => p.value.name === '__always_on')) {
        loadedProfiles.push(createProfile('__always_on'));
      }
      if (!loadedProfiles.find(p => p.value.name === '__favorites')) {
        loadedProfiles.push(createProfile('__favorites'));
      }

      loadedProfiles.sort((a, b) => {
        if (a.isReserved && !b.isReserved) return -1;
        if (!a.isReserved && b.isReserved) return 1;
        return a.shortName.toUpperCase().localeCompare(b.shortName.toUpperCase());
      });

      items = loadedProfiles;
    } catch (e) {
      console.error("Failed to load profiles:", e);
    }
  })();

  const find = (name) => items.find(p => p.value.name === name);

  return {
    get items() {
      return items;
    },
    get localProfiles() {
      return localProfiles;
    },
    find,
    add(name) {
      if (!name || find(name)) return null;
      const newProfile = createProfile(name);
      items = [...items, newProfile].sort((a, b) => {
        if (a.isReserved && !b.isReserved) return -1;
        if (!a.isReserved && b.isReserved) return 1;
        return a.shortName.toUpperCase().localeCompare(b.shortName.toUpperCase());
      });
      return newProfile;
    },
    remove(profileToRemove) {
      items = items.filter(p => p.value.name !== profileToRemove.value.name);
    },
    async save() {
      const dataToSave = {};
      items.forEach(p => {
        dataToSave[p.value.name] = [...p.value.items];
      });

      try {
        await storageSet({profiles: dataToSave, localProfiles: false});
        localProfiles = false;
        console.log('Profiles saved to sync storage.');
      } catch (error) {
        console.warn('Sync storage failed, falling back to local storage.', error);
        await chrome.storage.local.set({profiles: dataToSave});
        await storageSet({localProfiles: true});
        localProfiles = true;
      }
    },
  };
}

export const profiles = createProfilesStore();