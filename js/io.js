define(/* IO */ function() {
  
  var supportsLocalStorage = false;
  
  var read = function(key) {
    if (!supportsLocalStorage) {
      return null;
    }

    return localStorage.getItem(key);
  };
  
  var write = function(key, val) {
    if (!supportsLocalStorage) {
      return;
    }
    localStorage.setItem(key, val);
  };
  
  return {
    init: function() {
      try {
          localStorage.setItem("test", "test");
          localStorage.removeItem("test");
          supportsLocalStorage = true;
      } catch(e) {
          supportsLocalStorage = false;
      }
    },
    
    read: read,
    
    readObject: function(key) {
      var value = read(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    },
    
    write: write,
    
    writeObject: function(key, val) {
      if (!val) {
        return null;
      }
      write(key, JSON.stringify(val));
    }
  };
});