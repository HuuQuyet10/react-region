const LocalStorage = {
  set: function (key, value) {
    window.localStorage.setItem(key, value);
  },
  get: function (key, defaultValue) {
    return window.localStorage.getItem(key) || defaultValue;
  },
  setObject: function (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  getObject: function (key, value) {
    return JSON.parse(window.localStorage.getItem(key) || JSON.stringify(value));
  },
  clear: function () {
    return window.localStorage.clear();
  },
  removeItem: function (key) {
    return window.localStorage.removeItem(key);
  },
};

export default LocalStorage;
