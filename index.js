var Sprite = require('./lib/sprite-webpack');
var _ = require('lodash');
var Promise = require('bluebird');

function SpriteWebpackPlugin(options) {
  var opt = Sprite.options;
  this.options = _.assign(opt, options);
}

SpriteWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;
  var opt = self.options;
  var newOpt = _.clone(opt, true);
  // Options for 2x scaled images
  newOpt = _.assign(newOpt, {
    source: opt.source + 'scaled-at-200/',
    spriteName: opt.spriteName + '@2x'
  });

  compiler.plugin('run', function(compiler, callback) {
    self.compileSprite(opt, newOpt, callback)
  });
  var watchStarted = false;
  compiler.plugin('watch-run', function (watcher, watchRunCallback) {
    if (watchStarted) {
      return watchRunCallback();
    }
    watchStarted = true;
    self.compileSprite(opt, newOpt, watchRunCallback)
  });
};

SpriteWebpackPlugin.prototype.compileSprite = function(opt, newOpt, cb) {
  Sprite.createStyles(opt);
  Promise.resolve().then(function() {
    console.log('Generate sprites')
    return Sprite.createImage(opt);
  }).then(function() {
    console.log('Generate sprites @2x')
    return Sprite.createImage(newOpt);
  }).then(function() {
    Sprite.addImport(opt);
    cb();
  });
};

module.exports = SpriteWebpackPlugin;
