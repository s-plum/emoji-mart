var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

import Skins from './skins';

var SkinsDot = function (_Skins) {
  _inherits(SkinsDot, _Skins);

  function SkinsDot(props) {
    _classCallCheck(this, SkinsDot);

    var _this = _possibleConstructorReturn(this, (SkinsDot.__proto__ || Object.getPrototypeOf(SkinsDot)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
    return _this;
  }

  _createClass(SkinsDot, [{
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      // if either enter or space is pressed, then execute
      if (event.keyCode === 13 || event.keyCode === 32) {
        this.handleClick(event);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var skin = _props.skin;
      var i18n = _props.i18n;
      var opened = this.state.opened;

      var skinToneNodes = [];

      for (var skinTone = 1; skinTone <= 6; skinTone++) {
        var selected = skinTone === skin;
        var visible = opened || selected;
        skinToneNodes.push(React.createElement(
          'span',
          _extends({
            key: 'skin-tone-' + skinTone,
            className: 'emoji-mart-skin-swatch' + (selected ? ' selected' : ''),
            'aria-label': i18n.skintones[skinTone],
            'aria-hidden': !visible
          }, opened ? { role: 'menuitem' } : {}),
          React.createElement('span', _extends({
            onClick: this.handleClick,
            onKeyDown: this.handleKeyDown,
            role: 'button'
          }, selected ? {
            'aria-haspopup': true,
            'aria-expanded': !!opened
          } : {}, opened ? { 'aria-pressed': !!selected } : {}, {
            tabIndex: visible ? '0' : '',
            'aria-label': i18n.skintones[skinTone],
            title: i18n.skintones[skinTone],
            'data-skin': skinTone,
            className: 'emoji-mart-skin emoji-mart-skin-tone-' + skinTone
          }))
        ));
      }

      return React.createElement(
        'section',
        {
          className: 'emoji-mart-skin-swatches' + (opened ? ' opened' : ''),
          'aria-label': i18n.skintext
        },
        React.createElement(
          'div',
          opened ? { role: 'menubar' } : {},
          skinToneNodes
        )
      );
    }
  }]);

  return SkinsDot;
}(Skins);

export default SkinsDot;


SkinsDot.propTypes /* remove-proptypes */ = {
  onChange: PropTypes.func,
  skin: PropTypes.number.isRequired,
  i18n: PropTypes.object
};

SkinsDot.defaultProps = {
  onChange: function onChange() {}
};