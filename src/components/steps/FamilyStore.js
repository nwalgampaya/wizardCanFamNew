var o = {};

var Store = {
  saveFamilySearchState: function(state) {
    o["state"] = state;
  },
  geFamilySearchState: function() {
    return o["state"];
  },
  clearFamilySearchState: function() {
    o = {};
  }
};

module.exports = Store;
