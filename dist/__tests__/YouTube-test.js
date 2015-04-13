'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _React = require('react/addons');

var _React2 = _interopRequireWildcard(_React);

var _globalize = require('random-global');

var _globalize2 = _interopRequireWildcard(_globalize);

var _createPlayer = require('../lib/createPlayer');

var _createPlayer2 = _interopRequireWildcard(_createPlayer);

var _YouTube = require('../YouTube');

var _YouTube2 = _interopRequireWildcard(_YouTube);

jest.dontMock('../YouTube');

var TestUtils = _React2['default'].addons.TestUtils;

var url = 'https://www.youtube.com/watch?v=tITYj52gXxU';
var url2 = 'https://www.youtube.com/watch?v=vW7qFzT7cbA';
var playerMock = undefined;

describe('YouTube Component', function () {
  beforeEach(function () {

    /**
     * Mock out YouTube player API
     */

    window.YT = {
      PlayerState: {
        ENDED: 0,
        PLAYING: 1,
        PAUSED: 2,
        BUFFERING: 3
      }
    };

    playerMock = {
      destroy: jest.genMockFunction(),
      addEventListener: jest.genMockFunction(),
      removeEventListener: jest.genMockFunction()
    };

    _createPlayer2['default'].mockImplementation(function (props, cb) {
      return cb(playerMock);
    });
  });

  afterEach(function () {
    _globalize2['default'].mockClear();
    _createPlayer2['default'].mockClear();
  });

  describe('instantiation', function () {
    it('should render a YouTube API ready div', function () {
      var youtube = TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url }));
      var div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();

      expect(div.getAttribute('id')).toBe('react-yt-player');
    });

    it('should create a new YouTube widget', function () {
      TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url }));
      expect(_createPlayer2['default'].mock.calls[0][0].id).toBe('react-yt-player');
    });
  });

  describe('appearance', function () {
    it('should accept a custom id', function () {
      var youtube = TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url, id: 'custom-id' }));
      var div = TestUtils.findRenderedDOMComponentWithTag(youtube, 'div').getDOMNode();

      expect(div.getAttribute('id')).toBe('custom-id');
    });
  });

  describe('functionality', function () {
    var Container = (function (_React$Component) {
      function Container(props) {
        _classCallCheck(this, Container);

        _get(Object.getPrototypeOf(Container.prototype), 'constructor', this).call(this, props);

        this.state = {
          url: url
        };

        this._changeUrl = this._changeUrl.bind(this);
      }

      _inherits(Container, _React$Component);

      _createClass(Container, [{
        key: 'render',
        value: function render() {
          return _React2['default'].createElement(
            'div',
            null,
            _React2['default'].createElement(_YouTube2['default'], { url: this.state.url }),
            _React2['default'].createElement('button', { onClick: this._changeUrl })
          );
        }
      }, {
        key: '_changeUrl',
        value: function _changeUrl() {
          this.setState({ url: url2 });
        }
      }]);

      return Container;
    })(_React2['default'].Component);

    it('should load a `url`', function () {
      var container = TestUtils.renderIntoDocument(_React2['default'].createElement(Container, null));
      var youtube = TestUtils.findRenderedComponentWithType(container, _YouTube2['default']);

      // trigger player ready event.
      youtube._handlePlayerReady();

      expect(_createPlayer2['default'].mock.calls[0][0].url).toBe(url);
    });

    it('should load new `url`s', function () {
      var container = TestUtils.renderIntoDocument(_React2['default'].createElement(Container, null));
      var youtube = TestUtils.findRenderedComponentWithType(container, _YouTube2['default']);
      var changeUrl = TestUtils.findRenderedDOMComponentWithTag(container, 'button');

      // trigger player ready event.
      youtube._handlePlayerReady();

      TestUtils.Simulate.click(changeUrl);

      expect(_createPlayer2['default'].mock.calls[1][0].url).toBe(url2);
    });

    it('should only rerender for new `url`s', function () {
      var container = TestUtils.renderIntoDocument(_React2['default'].createElement(Container, null));
      var youtube = TestUtils.findRenderedComponentWithType(container, _YouTube2['default']);
      var changeUrl = TestUtils.findRenderedDOMComponentWithTag(container, 'button');

      // trigger player ready event.
      youtube._handlePlayerReady();

      // switch `url` to url2
      TestUtils.Simulate.click(changeUrl);
      expect(_createPlayer2['default'].mock.calls.length).toBe(2);

      // calling it again won't do anything since `url` is already
      // url2
      TestUtils.Simulate.click(changeUrl);
      expect(_createPlayer2['default'].mock.calls.length).toBe(2);
    });
  });

  describe('events', function () {
    it('should register event handlers onto the global namespace', function () {
      TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url }));
      expect(_globalize2['default'].mock.calls.length).toBe(2);
    });

    it('should bind event handlers to the player', function () {
      TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url }));
      expect(playerMock.addEventListener.mock.calls.length).toBe(2);
    });

    it('should bind an event handler to player events', function () {
      var onReady = jest.genMockFunction();
      var youtube = TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url, onReady: onReady }));

      youtube._handlePlayerReady();
      expect(onReady.mock.calls.length).toBe(1);
    });

    it('should bind event handler props to playback events', function () {
      var onPlay = jest.genMockFunction();
      var onPause = jest.genMockFunction();
      var onEnd = jest.genMockFunction();
      var youtube = TestUtils.renderIntoDocument(_React2['default'].createElement(_YouTube2['default'], { url: url,
        onPlay: onPlay,
        onPause: onPause,
        onEnd: onEnd
      }));

      // video playing
      youtube._handlePlayerStateChange({ data: window.YT.PlayerState.PLAYING });
      expect(onPlay.mock.calls.length).toBe(1);

      // video paused
      youtube._handlePlayerStateChange({ data: window.YT.PlayerState.PAUSED });
      expect(onPlay.mock.calls.length).toBe(1);

      // video ended
      youtube._handlePlayerStateChange({ data: window.YT.PlayerState.ENDED });
      expect(onEnd.mock.calls.length).toBe(1);
    });
  });

  describe('destruction', function () {

    /**
     * These tests use the regular methods of rendering components instead
     * of `TestUtils.renderIntoDocument`. TestUtils forces the component
     * into a detached DOM node, making it difficult to unmount.
     */

    it('should remove player event listeners when unmounted', function () {
      _React2['default'].render(_React2['default'].createElement(_YouTube2['default'], { url: url }), document.body);
      _React2['default'].unmountComponentAtNode(document.body);

      expect(playerMock.removeEventListener.mock.calls.length).toBe(2);
    });

    it('should destroy event handlers on the global namespace when unmounted', function () {
      window.fakeGlobalEventHandler = 'this is a fake event handler.';
      _globalize2['default'].mockReturnValue('fakeGlobalEventHandler');

      _React2['default'].render(_React2['default'].createElement(_YouTube2['default'], { url: url }), document.body);

      // trigger unmounting
      _React2['default'].unmountComponentAtNode(document.body);
      expect(window.fakeGlobalEventHandler).not.toBeDefined();
    });

    it('should destroy the player/iframe when unmounted', function () {
      _React2['default'].render(_React2['default'].createElement(_YouTube2['default'], { url: url }), document.body);

      // trigger unmounting
      _React2['default'].unmountComponentAtNode(document.body);
      expect(playerMock.destroy.mock.calls.length).toBe(1);
    });
  });
});