'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Anchors extends _react2.default.PureComponent {
  constructor(props) {
    super(props);

    let defaultCategory = props.categories.filter(function (category) {
      return category.first;
    })[0];

    this.state = {
      selected: defaultCategory.name
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    var index = e.currentTarget.getAttribute('data-index');
    var { categories, onAnchorClick } = this.props;

    onAnchorClick(categories[index], index);
  }

  handleKeyUp() {
    var _this = this;

    return function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      if (code == 13) {
        _this.handleClick(e);
      }
    };
  }

  render() {
    var _this2 = this;

    var { categories, color, i18n, icons } = this.props,
        { selected } = this.state;

    return _react2.default.createElement(
      'nav',
      { className: 'emoji-mart-anchors', 'aria-label': i18n.categorieslabel },
      categories.map(function (category, i) {
        var { id, name, anchor } = category,
            isSelected = name == selected;

        if (anchor === false) {
          return null;
        }

        const iconId = id.startsWith('custom-') ? 'custom' : id;

        return _react2.default.createElement(
          'button',
          {
            type: 'button',
            key: id,
            'aria-label': i18n.categories[id],
            title: i18n.categories[id],
            'data-index': i,
            onClick: _this2.handleClick,
            onKeyUp: _this2.handleKeyUp(),
            className: `emoji-mart-anchor ${isSelected ? 'emoji-mart-anchor-selected' : ''}`,
            style: { color: isSelected ? color : null }
          },
          _react2.default.createElement(
            'span',
            { className: 'emoji-mart-anchor-icon' },
            icons.categories[id]()
          ),
          _react2.default.createElement('span', {
            className: 'emoji-mart-anchor-bar',
            style: { backgroundColor: color }
          })
        );
      })
    );
  }
}

exports.default = Anchors;
Anchors.propTypes /* remove-proptypes */ = {
  categories: _propTypes2.default.array,
  onAnchorClick: _propTypes2.default.func,
  icons: _propTypes2.default.object
};

Anchors.defaultProps = {
  categories: [],
  onAnchorClick: function () {},
  icons: {}
};