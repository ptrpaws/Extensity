document.addEventListener("DOMContentLoaded", function() {

  var SearchViewModel = function() {
    this.q = ko.observable("");
    // TODO: Add more search control here.
  };

  var SwitchViewModel = function(exts, profiles, opts) {
    var self = this;
    self.exts = exts;
    self.profiles = profiles;
    self.opts = opts;
    self.toggled = ko.observableArray().extend({persistable: "toggled"});
    self.any = ko.computed(() => self.toggled().length > 0);
    self.toggleStyle = ko.pureComputed(() => self.any() ? 'fa-toggle-off' : 'fa-toggle-on');

    const disableFilterFn = (item) => {
      if(!self.opts.keepAlwaysOn()) return true;
      return !self.profiles.always_on().items().includes(item.id());
    };

    self.flip = function() {
      if(self.any()) {
        // Re-enable
        self.toggled().forEach(id => {
          // Old disabled extensions may be removed
          try { self.exts.find(id).enable(); } catch(e) {}
        });
        self.toggled([]);
      } else {
        self.toggled(self.exts.enabled.pluck());
        self.exts.enabled.disable(disableFilterFn);
      }
    };
  };

  var ExtensityViewModel = function() {
    var self = this;

    self.profiles = new ProfileCollectionModel();
    self.exts = new ExtensionCollectionModel();
    self.opts = new OptionsCollection();
    self.dismissals = new DismissalsCollection();
    self.switch = new SwitchViewModel(self.exts, self.profiles, self.opts);
    self.search = new SearchViewModel();
    self.activeProfile = ko.observable().extend({persistable: "activeProfile"});

    const filterFn = (i) => {
      // Filtering function for search box
      if(!self.opts.searchBox() || !self.search.q()) return true;
      return i.name().toUpperCase().includes(self.search.q().toUpperCase());
    };

    const filterProfileFn = (i) => {
      if(!i.reserved()) return true;
      return self.opts.showReserved() && i.hasItems();
    };

    const filterFavoriteFn = (i) => self.profiles.favorites().contains(i);

    const multiSort = (a, b) => {
      const statusResult = (self.opts.enabledFirst() && !a.status()) - (self.opts.enabledFirst() && !b.status());
      if (statusResult !== 0) return statusResult;
      return a.name().toUpperCase().localeCompare(b.name().toUpperCase());
    };

    self.openChromeExtensions = () => openTab("chrome://extensions");
    self.launchApp = (app) => chrome.management.launchApp(app.id());
    self.launchOptions = (ext) => chrome.tabs.create({url: ext.optionsUrl(), active: true});

    self.listedExtensions = ko.computed(() => self.exts.extensions().filter(filterFn).sort(multiSort)).extend({countable: null});
    self.listedApps = ko.computed(() => self.exts.apps().filter(filterFn)).extend({countable: null});
    self.listedItems = ko.computed(() => self.exts.items().filter(filterFn)).extend({countable: null});
    self.listedProfiles = ko.computed(() => self.profiles.items().filter(filterProfileFn)).extend({countable: null});
    self.listedFavorites = ko.computed(() => self.exts.extensions().filter(filterFavoriteFn).filter(filterFn).sort(multiSort)).extend({countable: null});
    self.emptyItems = ko.pureComputed(() => self.listedApps.none() && self.listedExtensions.none());

    const union = (...arrays) => [...new Set([].concat(...arrays))];
    const intersection = (arr1, arr2) => arr1.filter(value => arr2.includes(value));
    const difference = (arr1, arr2) => arr1.filter(value => !arr2.includes(value));

    self.setProfile = function(p) {
      self.activeProfile(p.name());
      // Profile items, plus always-on items
      const ids = union(p.items(), self.profiles.always_on().items());
      const to_enable = intersection(self.exts.disabled.pluck(), ids);
      const to_disable = difference(self.exts.enabled.pluck(), ids);

      to_enable.forEach(id => self.exts.find(id).enable());
      to_disable.forEach(id => self.exts.find(id).disable());
    };

    self.unsetProfile = () => self.activeProfile(undefined);

    self.toggleExtension = function(e) {
      e.toggle();
      self.unsetProfile();
    };

    const openTab = (url) => {
      chrome.tabs.create({url: url});
      window.close();
    };
  };

  setTimeout(() => {
    const vm = new ExtensityViewModel();
    ko.bindingProvider.instance = new ko.secureBindingsProvider({});
    ko.applyBindings(vm, document.body);
  }, 0);

  // Workaround for Chrome bug https://bugs.chromium.org/p/chromium/issues/detail?id=307912
  window.setTimeout(() => { document.getElementById('workaround-307912').style.display = 'block'; }, 0);
});
