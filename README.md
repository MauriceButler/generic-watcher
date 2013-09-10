generic-watcher
===============

generic file watcher for Node.js

When you save changes to a watched file, the provided node module is run.

Installation
------------

    npm install -g generic-watcher


Usage
-----

    gw [options]

    Options:

      -h, --help                     output usage information
      -V, --version                  output the version number
      -v, --verbose                  Verbose output
      -w, --watch [path]             Watch Path [default ./]
      -t, --throttle [milliseconds]  Minimum time between processing [default 300]

      -m, --module [path]            Path to Node module to run
      -e, --excludedFiles <files>    Files to excluded from triggering



Licence
-------

MIT