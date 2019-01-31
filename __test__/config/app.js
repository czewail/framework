module.exports = {
  port: 8888,
  cluster: {
    enabled: false, /* enable cluster mode */
    workers: 0, /* Number of work processes, set to 0 by default using CPU cores */
    sticky: false, /* sticky session */
  },
  view_extension: 'html'
}
