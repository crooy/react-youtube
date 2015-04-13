'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * Module dependencies
 */

var _load = require('require-sdk');

var _load2 = _interopRequireWildcard(_load);

var _assign = require('object-assign');

var _assign2 = _interopRequireWildcard(_assign);

var _getYouTubeId = require('get-youtube-id');

var _getYouTubeId2 = _interopRequireWildcard(_getYouTubeId);

/**
 * Create a new `player` by requesting and using the YouTube Iframe API
 *
 * @param {Object} props
 *   @param {String} url - url to be loaded
 *   @param {String} id - id of div container
 *   @param {Object} playerVars - https://developers.google.com/youtube/player_parameters
 *
 * @param {Function} cb
 */

var createPlayer = function createPlayer(props, cb) {
  var sdk = loadApi();

  var params = _assign2['default']({}, props.opts, {
    videoId: _getYouTubeId2['default'](props.url)
  });

  return sdk(function (err) {
    // need to handle err better.
    if (err) {
      console.error(err);
    }

    return cb(new window.YT.Player(props.id, params));
  });
};

/**
 * Load the YouTube API
 *
 * @returns {Function}
 */

var loadApi = function loadApi() {
  var sdk = _load2['default']('https://www.youtube.com/iframe_api', 'YT');
  var loadTrigger = sdk.trigger();

  /**
   * The YouTube API requires a global ready event handler.
   * The YouTube API really sucks.
   */

  window.onYouTubeIframeAPIReady = function () {
    loadTrigger();
    delete window.onYouTubeIframeAPIReady;
  };

  return sdk;
};

/**
 * Expose `createPlayer`
 */

exports['default'] = createPlayer;
module.exports = exports['default'];