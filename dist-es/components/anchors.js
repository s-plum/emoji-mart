var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

var Anchors = function (_React$PureComponent) {
  _inherits(Anchors, _React$PureComponent);

  function Anchors(props) {
    _classCallCheck(this, Anchors);

    var _this = _possibleConstructorReturn(this, (Anchors.__proto__ || Object.getPrototypeOf(Anchors)).call(this, props));

    var defaultCategory = props.categories.filter(function (category) {
      return category.first;
    })[0];

    _this.state = {
      selected: defaultCategory.name
    };

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Anchors, [{
    key: 'handleClick',
    value: function handleClick(e) {
      var index = e.currentTarget.getAttribute('data-index');
      var _props = this.props;
      var categories = _props.categories;
      var onAnchorClick = _props.onAnchorClick;


      onAnchorClick(categories[index], index);
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp() {
      var _this2 = this;

      return function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
          _this2.handleClick(e);
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props;
      var categories = _props2.categories;
      var color = _props2.color;
      var i18n = _props2.i18n;
      var icons = _props2.icons;
      var selected = this.state.selected;


      return React.createElement(
        'nav',
        { className: 'emoji-mart-anchors', 'aria-label': i18n.categorieslabel },
        categories.map(function (category, i) {
          var id = category.id;
          var name = category.name;
          var anchor = category.anchor;
          var isSelected = name == selected;

          if (anchor === false) {
            return null;
          }

          var iconId = id.startsWith('custom-') ? 'custom' : id;

          return React.createElement(
            'button',
            {
              type: 'button',
              key: id,
              'aria-label': i18n.categories[id],
              title: i18n.categories[id],
              'data-index': i,
              onClick: _this3.handleClick,
              onKeyUp: _this3.handleKeyUp(),
              className: 'emoji-mart-anchor ' + (isSelected ? 'emoji-mart-anchor-selected' : ''),
              style: { color: isSelected ? color : null }
            },
            React.createElement(
              'span',
              { className: 'emoji-mart-anchor-icon' },
              icons.categories[id]()
            ),
            React.createElement('span', {
              className: 'emoji-mart-anchor-bar',
              style: { backgroundColor: color }
            })
          );
        })
      );
    }
  }]);

  return Anchors;
}(React.PureComponent);

export default Anchors;


Anchors.propTypes /* remove-proptypes */ = {
  categories: PropTypes.array,
  onAnchorClick: PropTypes.func,
  icons: PropTypes.object
};

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: function onAnchorClick() {},
  icons: {}
};