export const getAllExtensions = () => {
  return new Promise((resolve) => {
    chrome.management.getAll(resolve);
  });
};

export const storageGet = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, resolve);
  });
};

export const storageSet = (items) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(items, resolve);
  });
};

export const sessionGet = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.session.get(keys, resolve);
  });
};

export const sessionSet = (items) => {
  return new Promise((resolve) => {
    chrome.storage.session.set(items, resolve);
  });
};