'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('../../utils');

var _data = require('../../utils/data');

var _sharedProps = require('../../utils/shared-props');

var _sharedDefaultProps = require('../../utils/shared-default-props');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _getData = function (props) {
  var { emoji, skin, set, data } = props;
  return (0, _utils.getData)(emoji, skin, set, data);
};

const _getPosition = function (props) {
  var { sheet_x, sheet_y } = _getData(props),
      multiplyX = 100 / (props.sheetColumns - 1),
      multiplyY = 100 / (props.sheetRows - 1);

  return `${multiplyX * sheet_x}% ${multiplyY * sheet_y}%`;
};

const _getSanitizedData = function (props) {
  var { emoji, skin, set, data } = props;
  return (0, _utils.getSanitizedData)(emoji, skin, set, data);
};

const _handleClick = function (e, props) {
  if (!props.onClick) {
    return;
  }
  var { onClick } = props,
      emoji = _getSanitizedData(props);

  onClick(emoji, e);
};

const _handleOver = function (e, props) {
  if (!props.onOver) {
    return;
  }
  var { onOver } = props,
      emoji = _getSanitizedData(props);

  onOver(emoji, e);
};

const _handleLeave = function (e, props) {
  if (!props.onLeave) {
    return;
  }
  var { onLeave } = props,
      emoji = _getSanitizedData(props);

  onLeave(emoji, e);
};

const _isNumeric = function (value) {
  return !isNaN(value - parseFloat(value));
};

const _convertStyleToCSS = function (style) {
  let div = document.createElement('div');

  for (let key in style) {
    let value = style[key];

    if (_isNumeric(value)) {
      value += 'px';
    }

    div.style[key] = value;
  }

  return div.getAttribute('style');
};

const NimbleEmoji = function (props) {
  if (props.data.compressed) {
    (0, _data.uncompress)(props.data);
  }

  for (let k in NimbleEmoji.defaultProps) {
    if (props[k] == undefined && NimbleEmoji.defaultProps[k] != undefined) {
      props[k] = NimbleEmoji.defaultProps[k];
    }
  }

  let data = _getData(props);
  if (!data) {
    if (props.fallback) {
      return props.fallback(null, props);
    } else {
      return null;
    }
  }

  let { unified, custom, short_names, imageUrl } = data,
      style = {},
      children = props.children,
      className = 'emoji-mart-emoji',
      nativeEmoji = unified && (0, _utils.unifiedToNative)(unified),

  // combine the emoji itself and all shortcodes into an accessible label
  label = [nativeEmoji].concat(short_names).filter(Boolean).join(', '),
      title = null;

  if (!unified && !custom) {
    if (props.fallback) {
      return props.fallback(data, props);
    } else {
      return null;
    }
  }

  if (props.tooltip) {
    title = short_names[0];
  }

  if (props.native && unified) {
    className += ' emoji-mart-emoji-native';
    style = { fontSize: props.size };
    children = nativeEmoji;

    if (props.forceSize) {
      style.display = 'inline-block';
      style.width = props.size;
      style.height = props.size;
      style.wordBreak = 'keep-all';
    }
  } else if (custom) {
    className += ' emoji-mart-emoji-custom';
    style = {
      width: props.size,
      height: props.size,
      display: 'inline-block'
    };
    if (data.spriteUrl) {
      style = _extends({}, style, {
        backgroundImage: `url(${data.spriteUrl})`,
        backgroundSize: `${100 * props.sheetColumns}% ${100 * props.sheetRows}%`,
        backgroundPosition: _getPosition(props)
      });
    } else {
      style = _extends({}, style, {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      });
    }
  } else {
    let setHasEmoji = data[`has_img_${props.set}`] == undefined || data[`has_img_${props.set}`];

    if (!setHasEmoji) {
      if (props.fallback) {
        return props.fallback(data, props);
      } else {
        return null;
      }
    } else {
      style = {
        width: props.size,
        height: props.size,
        display: 'inline-block',
        backgroundImage: `url(${props.backgroundImageFn(props.set, props.sheetSize)})`,
        backgroundSize: `${100 * props.sheetColumns}% ${100 * props.sheetRows}%`,
        backgroundPosition: _getPosition(props)
      };
    }
  }

  var Tag = {
    name: 'span',
    props: {}
  };

  if (props.onClick && !props.readonly) {
    Tag.name = 'button';
    Tag.props = {
      type: 'button'
    };
  }

  if (props.html) {
    style = _convertStyleToCSS(style);
    return `<${Tag.name} style='${style}' aria-label='${label}' ${title ? `title='${title}'` : ''} class='${className}'>${children || ''}</${Tag.name}>`;
  } else {
    return _react2.default.createElement(
      Tag.name,
      _extends({
        onClick: function (e) {
          return _handleClick(e, props);
        },
        onMouseEnter: function (e) {
          return _handleOver(e, props);
        },
        onMouseLeave: function (e) {
          return _handleLeave(e, props);
        },
        'aria-label': label,
        title: title,
        className: className
      }, Tag.props),
      _react2.default.createElement(
        'span',
        { style: style },
        children
      )
    );
  }
};

NimbleEmoji.propTypes /* remove-proptypes */ = _extends({}, _sharedProps.EmojiPropTypes, {
  data: _propTypes2.default.object.isRequired
});
NimbleEmoji.defaultProps = _sharedDefaultProps.EmojiDefaultProps;

exports.default = NimbleEmoji;