// Local helper function, replacing _.str.prune
const pruneString = (str, length) => {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length - 3) + '...';
};

ko.extenders.pluckable = function(target, option) {
  // Pluck an iterable by an observable field
  target.pluck = ko.computed(function() {
    return target().map(function(i) { return i[option](); });
  });
};

ko.extenders.toggleable = function(target, option) {
  // Toggles for extension collections
  target.toggle = function(filterFn) {
    target().filter(filterFn).forEach(function(i) { i.toggle(); });
  };
  target.enable = function(filterFn) {
    target().filter(filterFn).forEach(function(i) { i.enable(); });
  };
  target.disable = function(filterFn) {
    target().filter(filterFn).forEach(function(i) { i.disable(); });
  };
};

ko.extenders.persistable = function(target, key) {
  // Persists a single observable (or observableArray) in cloud browser storage
  chrome.storage.sync.get(key, function(v) {
    if(v[key]) {
      target(v[key]);
    }
    target.subscribe(function(val) {
      const obj = {};
      obj[key] = val;
      chrome.storage.sync.set(obj);
    });
  });
};

ko.extenders.countable = function(target, option) {
  target.count = ko.computed(() => target().length);
  target.any = ko.computed(() => target().length > 0);
  target.many = ko.computed(() => target().length > 1);
  target.none = ko.computed(() => target().length === 0);
};

var fadeOutMessage = function(id) {
  const el = document.getElementById(id);
  el.className = "visible";
  setTimeout(() => { el.className = "fadeout"}, 2000);
};

var DismissalsCollection = function() {
  var self = this;
  self.dismissals = ko.observableArray();
  self.dismiss = (id) => self.dismissals.push(id);
  self.dismissed = (id) => self.dismissals.indexOf(id) !== -1;

  chrome.storage.sync.get("dismissals", function(arr) {
    self.dismissals(arr);
    self.dismissals.subscribe((a) => chrome.storage.sync.set({dismissals: a}));
  });
};

var OptionsCollection = function() {
  var self = this;
  var defs = {
    showHeader   : true,
    groupApps    : true,
    appsFirst    : false,
    enabledFirst : false,
    searchBox    : true,
    showOptions  : true,
    keepAlwaysOn : false,
    showReserved : false
  };

  Object.keys(defs).forEach(key => self[key] = ko.observable(defs[key]));

  self.save = function(callback) {
    const dataToSave = Object.keys(defs).reduce((obj, key) => {
      obj[key] = self[key]();
      return obj;
    }, {});
    chrome.storage.sync.set(dataToSave, callback);
  };

  chrome.storage.sync.get(Object.keys(defs), function(v) {
    Object.entries(v).forEach(([key, val]) => self[key](val));
  });
};

var ProfileModel = function(name, items) {
  var self = this;
  var reserved_names = { "__always_on": "Always On", "__favorites": "Favorites" };
  var icons = { "__default": "fa-user-circle-o", "__always_on": "fa-lightbulb-o", "__favorites": "fa-star" };

  self.name = ko.observable(name);
  self.items = ko.observableArray(items);
  self.reserved = ko.computed(() => self.name().startsWith("__"));
  self.hasItems = ko.computed(() => self.items().length > 0);
  self.short_name = ko.pureComputed(() => reserved_names[self.name()] || pruneString(self.name(), 30));
  self.icon = ko.pureComputed(() => icons[self.name()] || icons['__default']);
  self.contains = (i) => self.items().includes(i.id());

  return this;
};

var ProfileCollectionModel = function() {
  var self = this;
  self.items = ko.observableArray();
  self.localProfiles = ko.observable(undefined).extend({persistable: "localProfiles"});
  self.any = ko.computed(() => self.items().length > 0);
  self.add = (name, items) => self.items.push(new ProfileModel(name, items || []));
  self.find = (name) => self.items().find(i => i.name() == name);
  self.find_or_create = (name) => self.find(name) || new ProfileModel(name, []);
  self.always_on = () => self.find_or_create("__always_on");
  self.favorites = () => self.find_or_create("__favorites");
  self.remove = (profile) => self.items.remove(profile);
  self.exists = (name) => !!self.find(name);

  self.save = function(callback) {
    const r = {};
    self.items().forEach(i => {
      if (i.name()) r[i.name()] = [...new Set(i.items())];
    });

    chrome.storage.sync.set({profiles: r}, function(val) {
      if(chrome.runtime.lastError) {
        self.localProfiles(true);
        chrome.storage.local.set({profiles: r}, callback);
      } else {
        self.localProfiles(false);
        if (callback) callback(val);
      }
    });
  };

  chrome.storage.sync.get("localProfiles", function(v) {
    const storage = v.localProfiles ? chrome.storage.local : chrome.storage.sync;
    const sortFn = (a, b) => {
      const aName = (a.startsWith("__") ? " " : "") + a.toUpperCase();
      const bName = (b.startsWith("__") ? " " : "") + b.toUpperCase();
      return aName.localeCompare(bName);
    };

    storage.get("profiles", function(p) {
      p = p['profiles'] || {};
      Object.keys(p).sort(sortFn).forEach(name => {
        self.items.push(new ProfileModel(name, p[name]));
      });
    });
  });

  return this;
};

var ExtensionModel = function(e) {
  var self = this;
  const smallestIcon = (icons) => {
    if (!icons || icons.length === 0) return '';
    const smallest = icons.reduce((min, icon) => icon.size < min.size ? icon : min, icons[0]);
    return smallest?.url || '';
  };

  self.id = ko.observable(e.id);
  self.name = ko.observable(e.name);
  self.type = e.type;
  self.mayDisable = e.mayDisable;
  self.isApp = ko.observable(e.isApp);
  self.icon = smallestIcon(e.icons);
  self.status = ko.observable(e.enabled);
  self.optionsUrl = ko.observable(e.optionsUrl);
  self.installType = ko.observable(e.installType);
  self.disabled = ko.pureComputed(() => !self.status());
  self.is_development = ko.pureComputed(() => self.installType() == 'development');
  self.short_name = ko.computed(() => pruneString(self.name(), 40));
  self.toggle = () => self.status(!self.status());
  self.enable = () => self.status(true);
  self.disable = () => self.status(false);
  self.status.subscribe(value => chrome.management.setEnabled(self.id(), value));
};

var ExtensionCollectionModel = function() {
  var self = this;
  self.items = ko.observableArray();
  const typeFilter = (types) => self.items().filter(item => types.includes(item.type));

  self.extensions = ko.computed(() => typeFilter(['extension']).filter(i => i.mayDisable)).extend({pluckable: 'id', toggleable: null});
  self.apps = ko.computed(() => typeFilter(["hosted_app", "packaged_app", "legacy_packaged_app"])).extend({pluckable: 'id', toggleable: null});
  self.enabled = ko.pureComputed(() => self.extensions().filter(i => i.status())).extend({pluckable: 'id', toggleable: null});
  self.disabled = ko.pureComputed(() => self.extensions().filter(i => !i.status())).extend({pluckable: 'id', toggleable: null});
  self.find = (id) => self.items().find(i => i.id() == id);

  chrome.management.getAll(function(results) {
    results
      .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
      .forEach(i => {
        if (i.name != "Extensity" && i.type != 'theme') {
          self.items.push(new ExtensionModel(i));
        }
      });
  });
};
