# liferay-watch

Watcher utility to help when developing on Liferay 7.0

## Requirements

This tool requires [Node.js](https://nodejs.org). I've only tested it at version [6.6.0](https://nodejs.org/en/blog/release/v6.6.0/), but it should work with newer versions. Please open an issue if you run into any problems.

## Installation

`[sudo] npm install -g liferay-watch`

## Usage

We try to stick with a zero configuration approach. In most cases, all that's needed is:

1. Navigate on the command line to the osgi module you are developing
2. Run command `lwatch`

Since [v2.0.0](https://github.com/brunobasto/liferay-watch/releases/tag/v2.0.0), we introduced an optional configuration file called `.lwatch.json` that, when needed, should be placed at the root of the module's folder. The file contents are expected to be on a JSON format. An example of what configurations can be overriden can be seen [here](https://github.com/brunobasto/liferay-watch/blob/master/config.json).

One example of why you would need to add this file is if you have your gogo shell running at a different port other than the default 11311. Say you have it at 11312. All you need to do is create a `.lwatch.json` file with the following content:

```
{
    gogoPort: 11312
}
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
