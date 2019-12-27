var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

import NimbleEmoji from './emoji/nimble-emoji';

var NotFound = function (_React$PureComponent) {
  _inherits(NotFound, _React$PureComponent);

  function NotFound() {
    _classCallCheck(this, NotFound);

    return _possibleConstructorReturn(this, (NotFound.__proto__ || Object.getPrototypeOf(NotFound)).apply(this, arguments));
  }

  _createClass(NotFound, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var data = _props.data;
      var emojiProps = _props.emojiProps;
      var i18n = _props.i18n;
      var notFound = _props.notFound;
      var notFoundEmoji = _props.notFoundEmoji;


      var component = notFound && notFound() || React.createElement(
        'div',
        { className: 'emoji-mart-no-results' },
        NimbleEmoji(_extends({
          data: data
        }, emojiProps, {
          size: 38,
          emoji: notFoundEmoji,
          onOver: null,
          onLeave: null,
          onClick: null
        })),
        React.createElement(
          'div',
          { className: 'emoji-mart-no-results-label' },
          i18n.notfound
        )
      );

      return component;
    }
  }]);

  return NotFound;
}(React.PureComponent);

export default NotFound;


NotFound.propTypes /* remove-proptypes */ = {
  notFound: PropTypes.func.isRequired,
  emojiProps: PropTypes.object.isRequired
};