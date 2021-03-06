'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throttleIdleTask = exports.measureScrollbar = exports.unifiedToNative = exports.deepMerge = exports.intersect = exports.uniq = exports.getSanitizedData = exports.getEmojiDataFromNative = exports.getData = undefined;

var _data = require('./data');

var _stringFromCodePoint = require('../polyfills/stringFromCodePoint');

var _stringFromCodePoint2 = _interopRequireDefault(_stringFromCodePoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COLONS_REGEX = /^(?:\:([^\:]+)\:)(?:\:skin-tone-(\d)\:)?$/;
const SKINS = ['1F3FA', '1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

function unifiedToNative(unified) {
  var unicodes = unified.split('-'),
      codePoints = unicodes.map(function (u) {
    return `0x${u}`;
  });

  return _stringFromCodePoint2.default.apply(null, codePoints);
}

function sanitize(emoji) {
  var {
    name,
    short_names,
    skin_tone,
    skin_variations,
    emoticons,
    unified,
    custom,
    customCategory,
    imageUrl
  } = emoji,
      id = emoji.id || short_names[0],
      colons = `:${id}:`;

  if (custom) {
    return {
      id,
      name,
      short_names,
      colons,
      emoticons,
      custom,
      customCategory,
      imageUrl
    };
  }

  if (skin_tone) {
    colons += `:skin-tone-${skin_tone}:`;
  }

  return {
    id,
    name,
    short_names,
    colons,
    emoticons,
    unified: unified.toLowerCase(),
    skin: skin_tone || (skin_variations ? 1 : null),
    native: unifiedToNative(unified)
  };
}

function getSanitizedData() {
  return sanitize(getData(...arguments));
}

function getData(emoji, skin, set, data) {
  var emojiData = {};

  if (typeof emoji == 'string') {
    let matches = emoji.match(COLONS_REGEX);

    if (matches) {
      emoji = matches[1];

      if (matches[2]) {
        skin = parseInt(matches[2], 10);
      }
    }

    if (data.aliases.hasOwnProperty(emoji)) {
      emoji = data.aliases[emoji];
    }

    if (data.emojis.hasOwnProperty(emoji)) {
      emojiData = data.emojis[emoji];
    } else {
      return null;
    }
  } else if (emoji.id) {
    if (data.aliases.hasOwnProperty(emoji.id)) {
      emoji.id = data.aliases[emoji.id];
    }

    if (data.emojis.hasOwnProperty(emoji.id)) {
      emojiData = data.emojis[emoji.id];
      skin || (skin = emoji.skin);
    }
  }

  if (!Object.keys(emojiData).length) {
    emojiData = emoji;
    emojiData.custom = true;

    if (!emojiData.search) {
      emojiData.search = (0, _data.buildSearch)(emoji);
    }
  }

  emojiData.emoticons || (emojiData.emoticons = []);
  emojiData.variations || (emojiData.variations = []);

  if (emojiData.skin_variations && skin > 1) {
    emojiData = JSON.parse(JSON.stringify(emojiData));

    var skinKey = SKINS[skin - 1],
        variationData = emojiData.skin_variations[skinKey];

    if (!variationData.variations && emojiData.variations) {
      delete emojiData.variations;
    }

    if (set && (variationData[`has_img_${set}`] == undefined || variationData[`has_img_${set}`]) || !set) {
      emojiData.skin_tone = skin;

      for (let k in variationData) {
        let v = variationData[k];
        emojiData[k] = v;
      }
    }
  }

  if (emojiData.variations && emojiData.variations.length) {
    emojiData = JSON.parse(JSON.stringify(emojiData));
    emojiData.unified = emojiData.variations.shift();
  }

  return emojiData;
}

function getEmojiDataFromNative(nativeString, set, data) {
  if (data.compressed) {
    (0, _data.uncompress)(data);
  }

  const skinTones = ['🏻', '🏼', '🏽', '🏾', '🏿'];
  const skinCodes = ['1F3FB', '1F3FC', '1F3FD', '1F3FE', '1F3FF'];

  let skin;
  let skinCode;
  let baseNativeString = nativeString;

  skinTones.forEach(function (skinTone, skinToneIndex) {
    if (nativeString.indexOf(skinTone) > 0) {
      skin = skinToneIndex + 2;
      skinCode = skinCodes[skinToneIndex];
    }
  });

  let emojiData;

  for (let id in data.emojis) {
    let emoji = data.emojis[id];

    let emojiUnified = emoji.unified;

    if (emoji.variations && emoji.variations.length) {
      emojiUnified = emoji.variations.shift();
    }

    if (skin && emoji.skin_variations && emoji.skin_variations[skinCode]) {
      emojiUnified = emoji.skin_variations[skinCode].unified;
    }

    if (unifiedToNative(emojiUnified) === baseNativeString) emojiData = emoji;
  }

  if (!emojiData) {
    return null;
  }

  emojiData.id = emojiData.short_names[0];

  return getSanitizedData(emojiData, skin, set, data);
}

function uniq(arr) {
  return arr.reduce(function (acc, item) {
    if (acc.indexOf(item) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);
}

function intersect(a, b) {
  const uniqA = uniq(a);
  const uniqB = uniq(b);

  return uniqA.filter(function (item) {
    return uniqB.indexOf(item) >= 0;
  });
}

function deepMerge(a, b) {
  var o = {};

  for (let key in a) {
    let originalValue = a[key],
        value = originalValue;

    if (b.hasOwnProperty(key)) {
      value = b[key];
    }

    if (typeof value === 'object') {
      value = deepMerge(originalValue, value);
    }

    o[key] = value;
  }

  return o;
}

// https://github.com/sonicdoe/measure-scrollbar
function measureScrollbar() {
  if (typeof document == 'undefined') return 0;
  const div = document.createElement('div');

  div.style.width = '100px';
  div.style.height = '100px';
  div.style.overflow = 'scroll';
  div.style.position = 'absolute';
  div.style.top = '-9999px';

  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div);

  return scrollbarWidth;
}

// Use requestIdleCallback() if available, else fall back to setTimeout().
// Throttle so as not to run too frequently.
function throttleIdleTask(func) {
  const doIdleTask = typeof requestIdleCallback === 'function' ? requestIdleCallback : setTimeout;

  let running = false;

  return function throttled() {
    if (running) {
      return;
    }
    running = true;
    doIdleTask(function () {
      running = false;
      func();
    });
  };
}

exports.getData = getData;
exports.getEmojiDataFromNative = getEmojiDataFromNative;
exports.getSanitizedData = getSanitizedData;
exports.uniq = uniq;
exports.intersect = intersect;
exports.deepMerge = deepMerge;
exports.unifiedToNative = unifiedToNative;
exports.measureScrollbar = measureScrollbar;
exports.throttleIdleTask = throttleIdleTask;