var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

import NimbleEmoji from './emoji/nimble-emoji';
import Skins from './skins';

var SkinsEmoji = function (_Skins) {
  _inherits(SkinsEmoji, _Skins);

  function SkinsEmoji(props) {
    _classCallCheck(this, SkinsEmoji);

    var _this = _possibleConstructorReturn(this, (SkinsEmoji.__proto__ || Object.getPrototypeOf(SkinsEmoji)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(SkinsEmoji, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var skin = _props.skin;
      var emojiProps = _props.emojiProps;
      var data = _props.data;
      var skinEmoji = _props.skinEmoji;
      var i18n = _props.i18n;
      var opened = this.state.opened;

      var skinToneNodes = [];

      for (var skinTone = 1; skinTone <= 6; skinTone++) {
        var selected = skinTone === skin;
        skinToneNodes.push(React.createElement(
          'span',
          {
            key: 'skin-tone-' + skinTone,
            className: 'emoji-mart-skin-swatch custom' + (selected ? ' selected' : '')
          },
          React.createElement(
            'span',
            {
              onClick: this.handleClick,
              'data-skin': skinTone,
              className: 'emoji-mart-skin-tone-' + skinTone
            },
            NimbleEmoji({
              emoji: skinEmoji,
              data: data,
              skin: skinTone,
              backgroundImageFn: emojiProps.backgroundImageFn,
              native: emojiProps.native,
              set: emojiProps.set,
              sheetSize: emojiProps.sheetSize,
              size: 23
            })
          )
        ));
      }

      return React.createElement(
        'div',
        {
          className: 'emoji-mart-skin-swatches custom' + (opened ? ' opened' : '')
        },
        React.createElement(
          'div',
          { className: 'emoji-mart-skin-text' + (opened ? ' opened' : '') },
          i18n.skintext
        ),
        skinToneNodes
      );
    }
  }]);

  return SkinsEmoji;
}(Skins);

export default SkinsEmoji;


SkinsEmoji.propTypes /* remove-proptypes */ = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  emojiProps: PropTypes.object.isRequired,
  skinTone: PropTypes.number,
  skinEmoji: PropTypes.string.isRequired,
  i18n: PropTypes.object
};

SkinsEmoji.defaultProps = {
  onChange: function onChange() {},
  skinTone: null
};