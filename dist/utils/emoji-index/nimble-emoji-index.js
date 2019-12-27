'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('..');

var _data = require('../data');

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NimbleEmojiIndex {
  constructor(data, set) {
    if (data.compressed) {
      (0, _data.uncompress)(data);
    }

    this.data = data || {};
    this.set = set || null;
    this.originalPool = {};
    this.index = {};
    this.emojis = {};
    this.emoticons = {};
    this.customEmojisList = [];

    this.buildIndex();
  }

  buildIndex() {
    var _this = this;

    for (let emoji in this.data.emojis) {
      let emojiData = this.data.emojis[emoji],
          { short_names, emoticons, skin_variations } = emojiData,
          id = short_names[0];

      if (emoticons) {
        emoticons.forEach(function (emoticon) {
          if (_this.emoticons[emoticon]) {
            return;
          }

          _this.emoticons[emoticon] = id;
        });
      }

      // If skin variations include them
      if (skin_variations) {
        this.emojis[id] = {};
        for (let skinTone = 1; skinTone <= 6; skinTone++) {
          this.emojis[id][skinTone] = (0, _.getSanitizedData)({ id, skin: skinTone }, skinTone, this.set, this.data);
        }
      } else {
        this.emojis[id] = (0, _.getSanitizedData)(id, null, this.set, this.data);
      }

      this.originalPool[id] = emojiData;
    }
  }

  clearCustomEmojis(pool) {
    var _this2 = this;

    this.customEmojisList.forEach(function (emoji) {
      let emojiId = emoji.id || emoji.short_names[0];

      delete pool[emojiId];
      delete _this2.emojis[emojiId];
    });
  }

  addCustomToPool(custom, pool) {
    var _this3 = this;

    if (this.customEmojisList.length) this.clearCustomEmojis(pool);

    custom.forEach(function (emoji) {
      let emojiId = emoji.id || emoji.short_names[0];

      if (emojiId && !pool[emojiId]) {
        pool[emojiId] = (0, _.getData)(emoji, null, null, _this3.data);
        _this3.emojis[emojiId] = (0, _.getSanitizedData)(emoji, null, null, _this3.data);
      }
    });

    this.customEmojisList = custom;
    this.index = {};
  }

  search(value, { emojisToShowFilter, maxResults, include, exclude, custom = [] } = {}) {
    var _this4 = this;

    if (this.customEmojisList != custom) this.addCustomToPool(custom, this.originalPool);

    const skinTone = _store2.default.get('skin') || 1;

    maxResults || (maxResults = 75);
    include || (include = []);
    exclude || (exclude = []);

    var results = null,
        pool = this.originalPool;

    if (value.length) {
      if (value == '-' || value == '-1') {
        return [this.emojis['-1'][skinTone]];
      }

      var values = value.toLowerCase().split(/[\s|,|\-|_]+/),
          allResults = [];

      if (values.length > 2) {
        values = [values[0], values[1]];
      }

      if (include.length || exclude.length) {
        pool = {};

        this.data.categories.forEach(function (category) {
          let isIncluded = include && include.length ? include.indexOf(category.id) > -1 : true;
          let isExcluded = exclude && exclude.length ? exclude.indexOf(category.id) > -1 : false;
          if (!isIncluded || isExcluded) {
            return;
          }

          category.emojis.forEach(function (emojiId) {
            return pool[emojiId] = _this4.data.emojis[emojiId];
          });
        });

        if (custom.length) {
          let customIsIncluded = include && include.length ? include.indexOf('custom') > -1 : true;
          let customIsExcluded = exclude && exclude.length ? exclude.indexOf('custom') > -1 : false;
          if (customIsIncluded && !customIsExcluded) {
            this.addCustomToPool(custom, pool);
          }
        }
      }

      allResults = values.map(function (value) {
        var aPool = pool,
            aIndex = _this4.index,
            length = 0;

        for (let charIndex = 0; charIndex < value.length; charIndex++) {
          const char = value[charIndex];
          length++;

          aIndex[char] || (aIndex[char] = {});
          aIndex = aIndex[char];

          if (!aIndex.results) {
            let scores = {};

            aIndex.results = [];
            aIndex.pool = {};

            for (let id in aPool) {
              let emoji = aPool[id],
                  { search } = emoji,
                  sub = value.substr(0, length),
                  subIndex = search.indexOf(sub);

              if (subIndex != -1) {
                let score = subIndex + 1;
                if (sub == id) score = 0;

                if (_this4.emojis[id] && _this4.emojis[id][skinTone]) {
                  aIndex.results.push(_this4.emojis[id][skinTone]);
                } else {
                  aIndex.results.push(_this4.emojis[id]);
                }
                aIndex.pool[id] = emoji;

                scores[id] = score;
              }
            }

            aIndex.results.sort(function (a, b) {
              var aScore = scores[a.id],
                  bScore = scores[b.id];

              if (aScore == bScore) {
                return a.id.localeCompare(b.id);
              } else {
                return aScore - bScore;
              }
            });
          }

          aPool = aIndex.pool;
        }

        return aIndex.results;
      }).filter(function (a) {
        return a;
      });

      if (allResults.length > 1) {
        results = _.intersect.apply(null, allResults);
      } else if (allResults.length) {
        results = allResults[0];
      } else {
        results = [];
      }
    }

    if (results) {
      if (emojisToShowFilter) {
        results = results.filter(function (result) {
          return emojisToShowFilter(pool[result.id]);
        });
      }

      if (results && results.length > maxResults) {
        results = results.slice(0, maxResults);
      }
    }

    return results;
  }
}
exports.default = NimbleEmojiIndex;