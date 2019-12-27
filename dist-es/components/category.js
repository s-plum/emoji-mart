var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

import frequently from '../utils/frequently';
import { getData } from '../utils';
import NimbleEmoji from './emoji/nimble-emoji';
import NotFound from './not-found';

var Category = function (_React$Component) {
  _inherits(Category, _React$Component);

  function Category(props) {
    _classCallCheck(this, Category);

    var _this = _possibleConstructorReturn(this, (Category.__proto__ || Object.getPrototypeOf(Category)).call(this, props));

    _this.data = props.data;
    _this.setContainerRef = _this.setContainerRef.bind(_this);
    _this.setLabelRef = _this.setLabelRef.bind(_this);
    return _this;
  }

  _createClass(Category, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.margin = 0;
      this.minMargin = 0;

      this.memoizeSize();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _props = this.props;
      var name = _props.name;
      var perLine = _props.perLine;
      var native = _props.native;
      var hasStickyPosition = _props.hasStickyPosition;
      var emojis = _props.emojis;
      var emojiProps = _props.emojiProps;
      var skin = emojiProps.skin;
      var size = emojiProps.size;
      var set = emojiProps.set;
      var nextPerLine = nextProps.perLine;
      var nextNative = nextProps.native;
      var nextHasStickyPosition = nextProps.hasStickyPosition;
      var nextEmojis = nextProps.emojis;
      var nextEmojiProps = nextProps.emojiProps;
      var nextSkin = nextEmojiProps.skin;
      var nextSize = nextEmojiProps.size;
      var nextSet = nextEmojiProps.set;
      var shouldUpdate = false;

      if (name == 'Recent' && perLine != nextPerLine) {
        shouldUpdate = true;
      }

      if (name == 'Search') {
        shouldUpdate = !(emojis == nextEmojis);
      }

      if (skin != nextSkin || size != nextSize || native != nextNative || set != nextSet || hasStickyPosition != nextHasStickyPosition) {
        shouldUpdate = true;
      }

      return shouldUpdate;
    }
  }, {
    key: 'memoizeSize',
    value: function memoizeSize() {
      if (!this.container) {
        // probably this is a test environment, e.g. jest
        this.top = 0;
        this.maxMargin = 0;
        return;
      }
      var parent = this.container.parentElement;

      var _container$getBoundin = this.container.getBoundingClientRect();

      var top = _container$getBoundin.top;
      var height = _container$getBoundin.height;

      var _parent$getBoundingCl = parent.getBoundingClientRect();

      var parentTop = _parent$getBoundingCl.top;

      var _label$getBoundingCli = this.label.getBoundingClientRect();

      var labelHeight = _label$getBoundingCli.height;

      var scrollTop = this.parent ? this.parent.scrollTop : 0;

      this.top = top - parentTop + parent.scrollTop;

      if (height == 0) {
        this.maxMargin = 0;
      } else {
        this.maxMargin = height - labelHeight;
      }
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll(scrollTop) {
      var margin = scrollTop - this.top;
      margin = margin < this.minMargin ? this.minMargin : margin;
      margin = margin > this.maxMargin ? this.maxMargin : margin;

      if (margin == this.margin) return;

      if (!this.props.hasStickyPosition) {
        this.label.style.top = margin + 'px';
      }

      this.margin = margin;
      return true;
    }
  }, {
    key: 'getEmojis',
    value: function getEmojis() {
      var _this2 = this;

      var _props2 = this.props;
      var name = _props2.name;
      var emojis = _props2.emojis;
      var recent = _props2.recent;
      var perLine = _props2.perLine;


      if (name == 'Recent') {
        var custom = this.props.custom;

        var frequentlyUsed = recent || frequently.get(perLine);

        if (frequentlyUsed.length) {
          emojis = frequentlyUsed.map(function (id) {
            var emoji = custom.filter(function (e) {
              return e.id === id;
            })[0];
            if (emoji) {
              return emoji;
            }

            return id;
          }).filter(function (id) {
            return !!getData(id, null, null, _this2.data);
          });
        }

        if (emojis.length === 0 && frequentlyUsed.length > 0) {
          return null;
        }
      }

      if (emojis) {
        emojis = emojis.slice(0);
      }

      return emojis;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay(display) {
      var emojis = this.getEmojis();

      if (!emojis || !this.container) {
        return;
      }

      this.container.style.display = display;
    }
  }, {
    key: 'setContainerRef',
    value: function setContainerRef(c) {
      this.container = c;
    }
  }, {
    key: 'setLabelRef',
    value: function setLabelRef(c) {
      this.label = c;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props3 = this.props;
      var id = _props3.id;
      var name = _props3.name;
      var hasStickyPosition = _props3.hasStickyPosition;
      var emojiProps = _props3.emojiProps;
      var i18n = _props3.i18n;
      var notFound = _props3.notFound;
      var notFoundEmoji = _props3.notFoundEmoji;
      var emojis = this.getEmojis();
      var labelStyles = {};
      var labelSpanStyles = {};
      var containerStyles = {};

      if (!emojis) {
        containerStyles = {
          display: 'none'
        };
      }

      if (!hasStickyPosition) {
        labelStyles = {
          height: 28
        };

        labelSpanStyles = {
          position: 'absolute'
        };
      }

      var label = i18n.categories[id] || name;

      return React.createElement(
        'section',
        {
          ref: this.setContainerRef,
          tabIndex: 0,
          title: name,
          className: 'emoji-mart-category',
          'aria-label': label,
          style: containerStyles
        },
        React.createElement(
          'div',
          {
            style: labelStyles,
            'data-name': name,
            className: 'emoji-mart-category-label'
          },
          React.createElement(
            'span',
            {
              style: labelSpanStyles,
              ref: this.setLabelRef,
              'aria-hidden': true /* already labeled by the section aria-label */
            },
            label
          )
        ),
        React.createElement(
          'ul',
          { className: 'emoji-mart-category-list' },
          emojis && emojis.map(function (emoji) {
            return React.createElement(
              'li',
              {
                key: emoji.short_names && emoji.short_names.join('_') || emoji
              },
              NimbleEmoji(_extends({ emoji: emoji, data: _this3.data }, emojiProps))
            );
          })
        ),
        emojis && !emojis.length && React.createElement(NotFound, {
          i18n: i18n,
          notFound: notFound,
          notFoundEmoji: notFoundEmoji,
          data: this.data,
          emojiProps: emojiProps
        })
      );
    }
  }]);

  return Category;
}(React.Component);

export default Category;


Category.propTypes /* remove-proptypes */ = {
  emojis: PropTypes.array,
  hasStickyPosition: PropTypes.bool,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool.isRequired,
  perLine: PropTypes.number.isRequired,
  emojiProps: PropTypes.object.isRequired,
  recent: PropTypes.arrayOf(PropTypes.string),
  notFound: PropTypes.func,
  notFoundEmoji: PropTypes.string.isRequired
};

Category.defaultProps = {
  emojis: [],
  hasStickyPosition: true
};