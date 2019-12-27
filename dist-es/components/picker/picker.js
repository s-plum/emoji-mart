var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import data from '../../../data/all.json';
import NimblePicker from './nimble-picker';

import { PickerPropTypes } from '../../utils/shared-props';
import { PickerDefaultProps } from '../../utils/shared-default-props';

var Picker = function (_React$PureComponent) {
  _inherits(Picker, _React$PureComponent);

  function Picker() {
    _classCallCheck(this, Picker);

    return _possibleConstructorReturn(this, (Picker.__proto__ || Object.getPrototypeOf(Picker)).apply(this, arguments));
  }

  _createClass(Picker, [{
    key: 'render',
    value: function render() {
      return React.createElement(NimblePicker, _extends({}, this.props, this.state));
    }
  }]);

  return Picker;
}(React.PureComponent);

export default Picker;


Picker.propTypes /* remove-proptypes */ = PickerPropTypes;
Picker.defaultProps = _extends({}, PickerDefaultProps, { data: data });