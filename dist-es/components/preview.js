var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

import { getData } from '../utils';
import NimbleEmoji from './emoji/nimble-emoji';
import SkinsEmoji from './skins-emoji';
import SkinsDot from './skins-dot';

var Preview = function (_React$PureComponent) {
  _inherits(Preview, _React$PureComponent);

  function Preview(props) {
    _classCallCheck(this, Preview);

    var _this = _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).call(this, props));

    _this.data = props.data;
    _this.state = { emoji: null };
    return _this;
  }

  _createClass(Preview, [{
    key: 'render',
    value: function render() {
      var emoji = this.state.emoji;
      var _props = this.props;
      var emojiProps = _props.emojiProps;
      var skinsProps = _props.skinsProps;
      var showSkinTones = _props.showSkinTones;
      var title = _props.title;
      var idleEmoji = _props.emoji;
      var i18n = _props.i18n;
      var showPreview = _props.showPreview;


      if (emoji && showPreview) {
        var emojiData = getData(emoji, null, null, this.data);
        var _emojiData$emoticons = emojiData.emoticons;
        var emoticons = _emojiData$emoticons === undefined ? [] : _emojiData$emoticons;
        var knownEmoticons = [];
        var listedEmoticons = [];

        emoticons.forEach(function (emoticon) {
          if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
            return;
          }

          knownEmoticons.push(emoticon.toLowerCase());
          listedEmoticons.push(emoticon);
        });

        return React.createElement(
          'div',
          { className: 'emoji-mart-preview' },
          React.createElement(
            'div',
            { className: 'emoji-mart-preview-emoji', 'aria-hidden': 'true' },
            NimbleEmoji(_extends({
              key: emoji.id,
              emoji: emoji,
              data: this.data
            }, emojiProps))
          ),
          React.createElement(
            'div',
            { className: 'emoji-mart-preview-data', 'aria-hidden': 'true' },
            React.createElement(
              'div',
              { className: 'emoji-mart-preview-name' },
              emoji.name
            ),
            React.createElement(
              'div',
              { className: 'emoji-mart-preview-shortnames' },
              emojiData.short_names.map(function (short_name) {
                return React.createElement(
                  'span',
                  { key: short_name, className: 'emoji-mart-preview-shortname' },
                  ':',
                  short_name,
                  ':'
                );
              })
            ),
            React.createElement(
              'div',
              { className: 'emoji-mart-preview-emoticons' },
              listedEmoticons.map(function (emoticon) {
                return React.createElement(
                  'span',
                  { key: emoticon, className: 'emoji-mart-preview-emoticon' },
                  emoticon
                );
              })
            )
          ),
          showSkinTones && React.createElement(
            'div',
            {
              className: 'emoji-mart-preview-skins' + (skinsProps.skinEmoji ? ' custom' : '')
            },
            skinsProps.skinEmoji ? React.createElement(SkinsEmoji, {
              skin: skinsProps.skin,
              emojiProps: emojiProps,
              data: this.data,
              skinEmoji: skinsProps.skinEmoji,
              i18n: i18n,
              onChange: skinsProps.onChange
            }) : React.createElement(SkinsDot, {
              skin: skinsProps.skin,
              i18n: i18n,
              onChange: skinsProps.onChange
            })
          )
        );
      } else {
        return React.createElement(
          'div',
          { className: 'emoji-mart-preview' },
          React.createElement(
            'div',
            { className: 'emoji-mart-preview-emoji', 'aria-hidden': 'true' },
            idleEmoji && idleEmoji.length && NimbleEmoji(_extends({ emoji: idleEmoji, data: this.data }, emojiProps))
          ),
          React.createElement(
            'div',
            { className: 'emoji-mart-preview-data', 'aria-hidden': 'true' },
            React.createElement(
              'span',
              { className: 'emoji-mart-title-label' },
              title
            )
          ),
          showSkinTones && React.createElement(
            'div',
            {
              className: 'emoji-mart-preview-skins' + (skinsProps.skinEmoji ? ' custom' : '')
            },
            skinsProps.skinEmoji ? React.createElement(SkinsEmoji, {
              skin: skinsProps.skin,
              emojiProps: emojiProps,
              data: this.data,
              skinEmoji: skinsProps.skinEmoji,
              i18n: i18n,
              onChange: skinsProps.onChange
            }) : React.createElement(SkinsDot, {
              skin: skinsProps.skin,
              i18n: i18n,
              onChange: skinsProps.onChange
            })
          )
        );
      }
    }
  }]);

  return Preview;
}(React.PureComponent);

export default Preview;


Preview.propTypes /* remove-proptypes */ = {
  showSkinTones: PropTypes.bool,
  title: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
  emojiProps: PropTypes.object.isRequired,
  skinsProps: PropTypes.object.isRequired
};

Preview.defaultProps = {
  showSkinTones: true,
  onChange: function onChange() {}
};