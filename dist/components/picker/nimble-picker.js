'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('../../vendor/raf-polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _svgs = require('../../svgs');

var icons = _interopRequireWildcard(_svgs);

var _store = require('../../utils/store');

var _store2 = _interopRequireDefault(_store);

var _frequently = require('../../utils/frequently');

var _frequently2 = _interopRequireDefault(_frequently);

var _utils = require('../../utils');

var _data = require('../../utils/data');

var _sharedProps = require('../../utils/shared-props');

var _anchors = require('../anchors');

var _anchors2 = _interopRequireDefault(_anchors);

var _category = require('../category');

var _category2 = _interopRequireDefault(_category);

var _preview = require('../preview');

var _preview2 = _interopRequireDefault(_preview);

var _search = require('../search');

var _search2 = _interopRequireDefault(_search);

var _sharedDefaultProps = require('../../utils/shared-default-props');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const I18N = {
  search: 'Search',
  clear: 'Clear', // Accessible label on "clear" button
  notfound: 'No Emoji Found',
  skintext: 'Choose your default skin tone',
  skipnav: 'Skip Emoji Keyboard Content',
  categories: {
    search: 'Search Results',
    recent: 'Frequently Used',
    people: 'Smileys & People',
    nature: 'Animals & Nature',
    foods: 'Food & Drink',
    activity: 'Activity',
    places: 'Travel & Places',
    objects: 'Objects',
    symbols: 'Symbols',
    flags: 'Flags',
    custom: 'Custom'
  },
  categorieslabel: 'Emoji categories', // Accessible title for the list of categories
  skintones: {
    1: 'Default Skin Tone',
    2: 'Light Skin Tone',
    3: 'Medium-Light Skin Tone',
    4: 'Medium Skin Tone',
    5: 'Medium-Dark Skin Tone',
    6: 'Dark Skin Tone'
  }
};

class NimblePicker extends _react2.default.PureComponent {
  constructor(props) {
    var _this;

    _this = super(props);

    this.CUSTOM = [];

    this.RECENT_CATEGORY = { id: 'recent', name: 'Recent', emojis: null };
    this.SEARCH_CATEGORY = {
      id: 'search',
      name: 'Search',
      emojis: null,
      anchor: false
    };

    if (props.data.compressed) {
      (0, _data.uncompress)(props.data);
    }

    this.data = props.data;
    this.i18n = (0, _utils.deepMerge)(I18N, props.i18n);
    this.icons = (0, _utils.deepMerge)(icons, props.icons);
    this.state = {
      skin: props.skin || _store2.default.get('skin') || props.defaultSkin,
      firstRender: true
    };

    this.idHash = `_${Math.random().toString(36).substr(2, 9)}`;

    this.categories = [];
    let allCategories = [].concat(this.data.categories);

    if (props.custom.length > 0) {
      const customCategories = {};
      let customCategoriesCreated = 0;

      props.custom.forEach(function (emoji) {
        if (!customCategories[emoji.customCategory]) {
          customCategories[emoji.customCategory] = {
            id: emoji.customCategory ? `custom-${emoji.customCategory}` : 'custom',
            name: emoji.customCategory || 'Custom',
            emojis: [],
            anchor: customCategoriesCreated === 0
          };

          customCategoriesCreated++;
        }

        const category = customCategories[emoji.customCategory];

        const customEmoji = _extends({}, emoji, {
          // `<Category />` expects emoji to have an `id`.
          id: emoji.short_names[0],
          custom: true
        });

        category.emojis.push(customEmoji);
        _this.CUSTOM.push(customEmoji);
      });

      allCategories.push(...Object.values(customCategories));
    }

    this.hideRecent = true;

    if (props.include != undefined) {
      allCategories.sort(function (a, b) {
        if (props.include.indexOf(a.id) > props.include.indexOf(b.id)) {
          return 1;
        }

        return -1;
      });
    }

    for (let categoryIndex = 0; categoryIndex < allCategories.length; categoryIndex++) {
      const category = allCategories[categoryIndex];
      let isIncluded = props.include && props.include.length ? props.include.indexOf(category.id) > -1 : true;
      let isExcluded = props.exclude && props.exclude.length ? props.exclude.indexOf(category.id) > -1 : false;
      if (!isIncluded || isExcluded) {
        continue;
      }

      if (props.emojisToShowFilter) {
        let newEmojis = [];

        const { emojis } = category;
        for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
          const emoji = emojis[emojiIndex];
          if (props.emojisToShowFilter(this.data.emojis[emoji] || emoji)) {
            newEmojis.push(emoji);
          }
        }

        if (newEmojis.length) {
          let newCategory = {
            emojis: newEmojis,
            name: category.name,
            id: category.id
          };

          this.categories.push(newCategory);
        }
      } else {
        this.categories.push(category);
      }
    }

    let includeRecent = props.include && props.include.length ? props.include.indexOf(this.RECENT_CATEGORY.id) > -1 : true;
    let excludeRecent = props.exclude && props.exclude.length ? props.exclude.indexOf(this.RECENT_CATEGORY.id) > -1 : false;
    if (includeRecent && !excludeRecent) {
      this.hideRecent = false;
      this.categories.unshift(this.RECENT_CATEGORY);
    }

    if (this.categories[0]) {
      this.categories[0].first = true;
    }

    this.categories.unshift(this.SEARCH_CATEGORY);

    this.setAnchorsRef = this.setAnchorsRef.bind(this);
    this.handleAnchorClick = this.handleAnchorClick.bind(this);
    this.setSearchRef = this.setSearchRef.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.setScrollRef = this.setScrollRef.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollPaint = this.handleScrollPaint.bind(this);
    this.handleEmojiOver = this.handleEmojiOver.bind(this);
    this.handleEmojiLeave = this.handleEmojiLeave.bind(this);
    this.handleEmojiClick = this.handleEmojiClick.bind(this);
    this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
    this.setPreviewRef = this.setPreviewRef.bind(this);
    this.handleSkinChange = this.handleSkinChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSkipKeyDown = this.handleSkipKeyDown.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.skin) {
      return _extends({}, state, {
        skin: props.skin
      });
    } else if (props.defaultSkin && !_store2.default.get('skin')) {
      return _extends({}, state, {
        skin: props.defaultSkin
      });
    }
    return state;
  }

  componentDidMount() {
    var _this2 = this;

    if (this.state.firstRender) {
      this.testStickyPosition();
      this.firstRenderTimeout = setTimeout(function () {
        _this2.setState({ firstRender: false });
      }, 60);
    }
  }

  componentDidUpdate() {
    this.updateCategoriesSize();
    this.handleScroll();
  }

  componentWillUnmount() {
    this.SEARCH_CATEGORY.emojis = null;

    clearTimeout(this.leaveTimeout);
    clearTimeout(this.firstRenderTimeout);
  }

  testStickyPosition() {
    const stickyTestElement = document.createElement('div');

    const prefixes = ['', '-webkit-', '-ms-', '-moz-', '-o-'];

    prefixes.forEach(function (prefix) {
      return stickyTestElement.style.position = `${prefix}sticky`;
    });

    this.hasStickyPosition = !!stickyTestElement.style.position.length;
  }

  handleEmojiOver(emoji) {
    var { preview } = this;
    if (!preview) {
      return;
    }

    // Use Array.prototype.find() when it is more widely supported.
    const emojiData = this.CUSTOM.filter(function (customEmoji) {
      return customEmoji.id === emoji.id;
    })[0];
    for (let key in emojiData) {
      if (emojiData.hasOwnProperty(key)) {
        emoji[key] = emojiData[key];
      }
    }

    preview.setState({ emoji });
    clearTimeout(this.leaveTimeout);
  }

  handleEmojiLeave(emoji) {
    var { preview } = this;
    if (!preview) {
      return;
    }

    this.leaveTimeout = setTimeout(function () {
      preview.setState({ emoji: null });
    }, 16);
  }

  handleEmojiClick(emoji, e) {
    this.props.onClick(emoji, e);
    this.handleEmojiSelect(emoji);
  }

  handleEmojiSelect(emoji) {
    var _this3 = this;

    this.props.onSelect(emoji);
    if (!this.hideRecent && !this.props.recent) _frequently2.default.add(emoji);

    var component = this.categoryRefs['category-1'];
    if (component) {
      let maxMargin = component.maxMargin;
      component.forceUpdate();

      window.requestAnimationFrame(function () {
        if (!_this3.scroll) return;
        component.memoizeSize();
        if (maxMargin == component.maxMargin) return;

        _this3.updateCategoriesSize();
        _this3.handleScrollPaint();

        if (_this3.SEARCH_CATEGORY.emojis) {
          component.updateDisplay('none');
        }
      });
    }
  }

  handleScroll() {
    if (!this.waitingForPaint) {
      this.waitingForPaint = true;
      window.requestAnimationFrame(this.handleScrollPaint);
    }
  }

  handleScrollPaint() {
    this.waitingForPaint = false;

    if (!this.scroll) {
      return;
    }

    let activeCategory = null;

    if (this.SEARCH_CATEGORY.emojis) {
      activeCategory = this.SEARCH_CATEGORY;
    } else {
      var target = this.scroll,
          scrollTop = target.scrollTop,
          scrollingDown = scrollTop > (this.scrollTop || 0),
          minTop = 0;

      for (let i = 0, l = this.categories.length; i < l; i++) {
        let ii = scrollingDown ? this.categories.length - 1 - i : i,
            category = this.categories[ii],
            component = this.categoryRefs[`category-${ii}`];

        if (component) {
          let active = component.handleScroll(scrollTop);

          if (!minTop || component.top < minTop) {
            if (component.top > 0) {
              minTop = component.top;
            }
          }

          if (active && !activeCategory) {
            activeCategory = category;
          }
        }
      }

      if (scrollTop < minTop) {
        activeCategory = this.categories.filter(function (category) {
          return !(category.anchor === false);
        })[0];
      } else if (scrollTop + this.clientHeight >= this.scrollHeight) {
        activeCategory = this.categories[this.categories.length - 1];
      }
    }

    if (activeCategory) {
      let { anchors } = this,
          { name: categoryName } = activeCategory;

      if (anchors.state.selected != categoryName) {
        anchors.setState({ selected: categoryName });
      }
    }

    this.scrollTop = scrollTop;
  }

  handleSearch(emojis) {
    this.SEARCH_CATEGORY.emojis = emojis;

    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.categoryRefs[`category-${i}`];

      if (component && component.props.name != 'Search') {
        let display = emojis ? 'none' : 'inherit';
        component.updateDisplay(display);
      }
    }

    this.forceUpdate();
    if (this.scroll) {
      this.scroll.scrollTop = 0;
    }
    this.handleScroll();
  }

  handleSkipKeyDown(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
      e.stopPropagation();
    }
  }

  handleAnchorClick(category, i) {
    var component = this.categoryRefs[`category-${i}`],
        { scroll, anchors } = this,
        scrollToComponent = null;

    if (component.container) {
      component.container.focus();
    }

    scrollToComponent = function () {
      if (component) {
        let { top } = component;

        if (category.first) {
          top = 0;
        } else {
          top += 1;
        }

        scroll.scrollTop = top;
      }
    };

    if (this.SEARCH_CATEGORY.emojis) {
      this.handleSearch(null);
      this.search.clear();

      window.requestAnimationFrame(scrollToComponent);
    } else {
      scrollToComponent();
    }
  }

  handleSkinChange(skin) {
    var newState = { skin: skin },
        { onSkinChange } = this.props;

    this.setState(newState);
    _store2.default.update(newState);

    onSkinChange(skin);
  }

  handleKeyDown(e) {
    let handled = false;

    switch (e.keyCode) {
      case 27:
        if (this.props.onEscape) {
          this.props.onEscape();
        } else if (this.skipNav) {
          this.skipNav.focus();
        }

        handled = true;
        break;
      case 13:
        let emoji;

        if (this.SEARCH_CATEGORY.emojis && this.SEARCH_CATEGORY.emojis.length && (emoji = (0, _utils.getSanitizedData)(this.SEARCH_CATEGORY.emojis[0], this.state.skin, this.props.set, this.props.data))) {
          this.handleEmojiSelect(emoji);
          handled = true;
        }

        break;
    }

    if (handled) {
      e.preventDefault();
    }
  }

  updateCategoriesSize() {
    for (let i = 0, l = this.categories.length; i < l; i++) {
      let component = this.categoryRefs[`category-${i}`];
      if (component) component.memoizeSize();
    }

    if (this.scroll) {
      let target = this.scroll;
      this.scrollHeight = target.scrollHeight;
      this.clientHeight = target.clientHeight;
    }
  }

  getCategories() {
    return this.state.firstRender ? this.categories.slice(0, 3) : this.categories;
  }

  setAnchorsRef(c) {
    this.anchors = c;
  }

  setSearchRef(c) {
    this.search = c;
  }

  setPreviewRef(c) {
    this.preview = c;
  }

  setScrollRef(c) {
    this.scroll = c;
  }

  setCategoryRef(name, c) {
    if (!this.categoryRefs) {
      this.categoryRefs = {};
    }

    this.categoryRefs[name] = c;
  }

  render() {
    var _this4 = this;

    var {
      perLine,
      emojiSize,
      set,
      sheetSize,
      sheetColumns,
      sheetRows,
      style,
      title,
      emoji,
      color,
      native,
      backgroundImageFn,
      emojisToShowFilter,
      showPreview,
      showSkinTones,
      emojiTooltip,
      include,
      exclude,
      recent,
      autoFocus,
      skinEmoji,
      notFound,
      notFoundEmoji,
      darkMode
    } = this.props,
        { skin } = this.state,
        width = perLine * (emojiSize + 12) + 12 + 2 + (0, _utils.measureScrollbar)();

    return _react2.default.createElement(
      'section',
      {
        style: _extends({ width: width }, style),
        className: `emoji-mart ${darkMode ? 'emoji-mart-dark' : ''}`,
        'aria-label': title,
        onKeyDown: this.handleKeyDown
      },
      _react2.default.createElement(
        'a',
        { className: 'emoji-mart-offscreen',
          id: `emoji-mart-start-${this.idHash}`,
          href: `#emoji-mart-end-${this.idHash}`,
          onKeyDown: this.handleSkipKeyDown
        },
        this.i18n.skipnav
      ),
      _react2.default.createElement(
        'div',
        { className: 'emoji-mart-bar' },
        _react2.default.createElement(_anchors2.default, {
          ref: this.setAnchorsRef,
          data: this.data,
          i18n: this.i18n,
          color: color,
          categories: this.categories,
          onAnchorClick: this.handleAnchorClick,
          icons: this.icons
        })
      ),
      _react2.default.createElement(_search2.default, {
        ref: this.setSearchRef,
        onSearch: this.handleSearch,
        data: this.data,
        i18n: this.i18n,
        emojisToShowFilter: emojisToShowFilter,
        include: include,
        exclude: exclude,
        custom: this.CUSTOM,
        autoFocus: autoFocus
      }),
      _react2.default.createElement(
        'div',
        {
          ref: this.setScrollRef,
          className: 'emoji-mart-scroll',
          onScroll: this.handleScroll,
          onKeyUp: this.handleKeyUp
        },
        this.getCategories().map(function (category, i) {
          return _react2.default.createElement(_category2.default, {
            ref: _this4.setCategoryRef.bind(_this4, `category-${i}`),
            key: category.name,
            id: category.id,
            name: category.name,
            emojis: category.emojis,
            perLine: perLine,
            native: native,
            hasStickyPosition: _this4.hasStickyPosition,
            data: _this4.data,
            i18n: _this4.i18n,
            recent: category.id == _this4.RECENT_CATEGORY.id ? recent : undefined,
            custom: category.id == _this4.RECENT_CATEGORY.id ? _this4.CUSTOM : undefined,
            emojiProps: {
              native: native,
              skin: skin,
              size: emojiSize,
              set: set,
              sheetSize: sheetSize,
              sheetColumns: sheetColumns,
              sheetRows: sheetRows,
              forceSize: native,
              tooltip: emojiTooltip,
              backgroundImageFn: backgroundImageFn,
              onOver: _this4.handleEmojiOver,
              onLeave: _this4.handleEmojiLeave,
              onClick: _this4.handleEmojiClick
            },
            notFound: notFound,
            notFoundEmoji: notFoundEmoji
          });
        })
      ),
      (showPreview || showSkinTones) && _react2.default.createElement(
        'div',
        { className: 'emoji-mart-bar' },
        _react2.default.createElement(_preview2.default, {
          ref: this.setPreviewRef,
          data: this.data,
          title: title,
          emoji: emoji,
          showSkinTones: showSkinTones,
          showPreview: showPreview,
          emojiProps: {
            native: native,
            size: 38,
            skin: skin,
            set: set,
            sheetSize: sheetSize,
            sheetColumns: sheetColumns,
            sheetRows: sheetRows,
            backgroundImageFn: backgroundImageFn
          },
          skinsProps: {
            skin: skin,
            onChange: this.handleSkinChange,
            skinEmoji: skinEmoji
          },
          i18n: this.i18n
        })
      ),
      _react2.default.createElement('a', { className: 'emoji-mart-offscreen',
        id: `emoji-mart-end-${this.idHash}`,
        href: `#emoji-mart-start-${this.idHash}`,
        onKeyDown: this.handleSkipKeyDown })
    );
  }
}

exports.default = NimblePicker;
NimblePicker.propTypes /* remove-proptypes */ = _extends({}, _sharedProps.PickerPropTypes, {
  data: _propTypes2.default.object.isRequired
});
NimblePicker.defaultProps = _extends({}, _sharedDefaultProps.PickerDefaultProps);