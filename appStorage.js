function AppStorage(appName)
{
    var prefix = (appName ? appName + "." : "");

    /* used to determine if localStorage is supported by the browser */
    this.localStorageSupported = (('localStorage' in window) && window['localStorage']);

    /* The setValue() method takes a key and a value to put into local storage.  */
    this.setValue = function(key, val)
    {
        if (this.localStorageSupported) localStorage.setItem(prefix + key, JSON.stringify(val));
        return this;
    };

    /* The getValue() method takes a key, prepends the prefix to it, and returns the string value associated with it in localStorage. */
    this.getValue = function(key)
    {
        if (this.localStorageSupported) return JSON.parse(localStorage.getItem(prefix + key));
        else return null;
    };

    /* Removes the value with the specified key */
    this.removeValue = function(key)
    {
        if (this.localStorageSupported) localStorage.removeItem(prefix + key);
        return this;
    };

    /* remove all keys for an application */
    this.removeAll = function()
    {
        var keys = this.getKeys();
        for (var i in keys)
        {
            this.remove(keys[i]);
        }
        return this;
    };

    /* determine if there is a value associated with a key in localStorage */
    this.contains = function(key)
    {
        return this.get(key) !== null;
    };

    /* This method will return an array of all key names for the application 
    by looping over all of the keys in localStorage */
    this.getKeys = function(filter)
    {
        var keys = [];
        if (this.localStorageSupported)
        {
            for (var key in localStorage)
            {
                if (isAppKey(key))
                {
                    // Remove the prefix from the key
                    if (prefix) key = key.slice(prefix.length);
                    // Check the filter
                    if (!filter || filter(key))
                    {
                        keys.push(key);
                    }
                }
            }
        }

        return keys;
    };

    function isAppKey(key)
    {
        if (prefix)
        {
            return key.indexOf(prefix) === 0;
        }
        return true;
    };
}
