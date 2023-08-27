new Proxy({}, {
  get(_, key) {
    throw new Error(`Module "fs/promises" has been externalized for browser compatibility. Cannot access "fs/promises.${key}" in client code.  See http://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`)
  }
});
