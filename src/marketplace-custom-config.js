import toolsIcon from './assets/blog1.jpg';
import color1 from './assets/Colours1.jpg';
import color2 from './assets/Colours2.jpg';
import color3 from './assets/Colours3.jpg';
import color4 from './assets/Colours4.jpg';
import toolsIcon1 from './assets/protectiveTextures.png';
import toolsIcon2 from './assets/coilyTextures.png';
import toolsIcon3 from './assets/curlyTextures.png';
import toolsIcon4 from './assets/wavyTextures.png';
import toolsIcon5 from './assets/straightTextures.png';
import toolsIcon6 from './assets/baldTextures.png';
import toolsIcon7 from './assets/Extensions.png';
/*
 * Marketplace specific configuration.
 *
 * Every filter needs to have following keys:
 * - id:     Unique id of the filter.
 * - label:  The default label of the filter.
 * - type:   String that represents one of the existing filter components:
 *           BookingDateRangeFilter, KeywordFilter, PriceFilter,
 *           SelectSingleFilter, SelectMultipleFilter.
 * - group:  Is this 'primary' or 'secondary' filter?
 *           Primary filters are visible on desktop layout by default.
 *           Secondary filters are behind "More filters" button.
 *           Read more from src/containers/SearchPage/README.md
 * - queryParamNames: Describes parameters to be used with queries
 *                    (e.g. 'price' or 'pub_amenities'). Most of these are
 *                    the same between webapp URLs and API query params.
 *                    You can't change 'dates', 'price', or 'keywords'
 *                    since those filters are fixed to a specific attribute.
 * - config: Extra configuration that the filter component needs.
 *
 * Note 1: Labels could be tied to translation file
 *         by importing FormattedMessage:
 *         <FormattedMessage id="some.translation.key.here" />
 *
 * Note 2: If you need to add new custom filter components,
 *         you need to take those into use in:
 *         src/containers/SearchPage/FilterComponent.js
 *
 * Note 3: If you just want to create more enum filters
 *         (i.e. SelectSingleFilter, SelectMultipleFilter),
 *         you can just add more configurations with those filter types
 *         and tie them with correct extended data key
 *         (i.e. pub_<key> or meta_<key>).
 */

export const hairTextures = [
  {
    key: 'protective',
    value: 'Protective',
    icon: toolsIcon1,
  },
  {
    key: 'extensions',
    value: 'Wigs & Extensions',
    icon: toolsIcon7,
  },

  {
    key: 'coily',
    value: 'Coily',
    icon: toolsIcon2,
  },
  {
    key: 'curly',
    value: 'Curly',
    icon: toolsIcon3,
  },
  {
    key: 'wavy',
    value: 'Wavy',
    icon: toolsIcon4,
  },
  {
    key: 'straight',
    value: 'Straight',
    icon: toolsIcon5,
  },
  {
    key: 'baldShaved',
    value: 'Bald / Shaved',
    icon: toolsIcon6,
  },
];

export const teamSizes = [
  {
    key: 'justMe',
    value: 'Just me',
    icon: toolsIcon,
  },
  {
    key: '2_4',
    value: '2-4',
    icon: toolsIcon,
  },
  {
    key: '4_6',
    value: '4-6',
    icon: toolsIcon,
  },
];

export const skinTones = [
  {
    key: 'color1',
    value: ' ',
    icon: color1,
  },
  {
    key: 'color2',
    value: ' ',
    icon: color2,
  },
  {
    key: 'color3',
    value: ' ',
    icon: color3,
  },
  {
    key: 'color4',
    value: ' ',
    icon: color4,
  },
];

export const skinTypes = [
  {
    key: 'acneProne',
    value: 'Acne Prone',
    icon: toolsIcon,
  },
  {
    key: 'sensitiveSkin',
    value: 'Sensitive Skin',
    icon: toolsIcon,
  },
  {
    key: 'normalSkin',
    value: 'Normal Skin ',
    icon: toolsIcon,
  },
  {
    key: 'matureSkin',
    value: 'Mature Skin',
    icon: toolsIcon,
  },
  {
    key: 'drySkin',
    value: 'Dry Skin',
    icon: toolsIcon,
  },
  {
    key: 'combination ',
    value: 'Combination ',
    icon: toolsIcon,
  },
];

export const timing = [
  {
    key: 'open',
    value: 'Open 24 hours',
  },
  {
    key: 'closed',
    value: 'Closed',
  },
];

export const offers = [
  {
    key: 'barberShop',
    value: 'Barber',
    icon: toolsIcon,
  },
  {
    key: 'hairStylist',
    value: 'Hair Stylist',
    icon: toolsIcon,
  },
  {
    key: 'braidsandlocs',
    value: 'Braids & Locs',
    icon: toolsIcon,
  },

  {
    key: 'extensions',
    value: 'Extensions & Wigs',
    icon: toolsIcon,
  },

  {
    key: 'makeupArtist',
    value: 'Makeup Artist',
    icon: toolsIcon,
  },
  {
    key: 'skinSpecialist',
    value: 'Skin Specialist',
    icon: toolsIcon,
  },
  {
    key: 'dermatologist',
    value: 'Dermatologist',
    icon: toolsIcon,
  },
  {
    key: 'eyebrows',
    value: 'Eyebrows',
    icon: toolsIcon,
  },
  {
    key: 'eyeLashes',
    value: 'Eye Lashes',
    icon: toolsIcon,
  },
  {
    key: 'hairRemoval',
    value: 'Hair Removal',
    icon: toolsIcon,
  },
  {
    key: 'nails',
    value: 'Nails',
    icon: toolsIcon,
  },

  {
    key: 'massage',
    value: 'Massage',
    icon: toolsIcon,
  },
  {
    key: 'physioMassage',
    value: 'Physio Massage',
    icon: toolsIcon,
  },

  {
    key: 'other',
    value: 'Other',
    icon: toolsIcon,
  },
];

export const canDo = [
  {
    key: 'destinationCalls',
    value: 'Mobile calls',
  },
  {
    key: 'houseCalls',
    value: 'House calls',
  },
];

export const bookingSystem = [
  {
    key: 'notCurrenltyUsingaBookingSystem',
    value: 'Not currenlty using a booking system',
  },
  {
    key: 'kitomba',
    value: 'Kitomba',
  },
  {
    key: 'gettimley',
    value: 'Gettimley',
  },
  {
    key: 'schedulista',
    value: 'Schedulista',
  },
  {
    key: 'squareup',
    value: 'Squareup',
  },
  {
    key: 'truelocal',
    value: 'Truelocal',
  },
  {
    key: 'fresha',
    value: 'Fresha',
  },
  {
    key: 'other',
    value: 'Other',
  },
];
export const filters = [
  {
    id: 'dates-length',
    label: 'Dates',
    type: 'BookingDateRangeLengthFilter',
    group: 'primary',
    // Note: BookingDateRangeFilter is fixed filter,
    // you can't change "queryParamNames: ['dates'],"
    queryParamNames: ['dates', 'minDuration'],
    config: {
      // A global time zone to use in availability searches. As listings
      // can be in various time zones, we must decide what time zone we
      // use in search when looking for available listings within a
      // certain time interval.
      //
      // If you have all/most listings in a certain time zone, change this
      // config value to that.
      //
      // See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
      searchTimeZone: 'Etc/UTC',

      // Options for the minimum duration of the booking
      options: [
        { key: '0', label: 'Any length' },
        { key: '60', label: '1 hour', shortLabel: '1h' },
        { key: '120', label: '2 hours', shortLabel: '2h' },
      ],
    },
  },

  //
  // {
  //   id: 'price',
  //   label: 'Price',
  //   type: 'PriceFilter',
  //   group: 'primary',
  //   // Note: PriceFilter is fixed filter,
  //   // you can't change "queryParamNames: ['price'],"
  //   queryParamNames: ['price'],
  //   // Price filter configuration
  //   // Note: unlike most prices this is not handled in subunits
  //   config: {
  //     min: 0,
  //     max: 1000,
  //     step: 5,
  //   },
  // },
  {
    id: 'keyword',
    label: 'Keyword',
    type: 'KeywordFilter',
    group: 'primary',
    // Note: KeywordFilter is fixed filter,
    // you can't change "queryParamNames: ['keywords'],"
    queryParamNames: ['keywords'],
    // NOTE: If you are ordering search results by distance
    // the keyword search can't be used at the same time.
    // You can turn on/off ordering by distance from config.js file.
    config: {},
  },

  {
    id: 'canDo',
    label: 'Can Do',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_canDo'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_all',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'destinationCalls',
          value: 'Mobile calls',
          label: 'Mobile calls',
        },
        {
          key: 'houseCalls',
          value: 'House calls',
          label: 'House calls',
        },
      ],
    },
  },
  {
    id: 'skinTones',
    label: 'Skin Tone',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_skinTones'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_all',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'color1',
          value: ' ',
          icon: color1,
        },
        {
          key: 'color2',
          value: ' ',
          icon: color2,
        },
        {
          key: 'color3',
          value: ' ',
          icon: color3,
        },
        {
          key: 'color4',
          value: ' ',
          icon: color4,
        },
      ],
    },
  },
  {
    id: 'skinTypes',
    label: 'Skin Types',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_skinTypes'],
    config: {
      // Optional modes: 'has_all', 'has_any'
      // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
      searchMode: 'has_all',

      // "key" is the option you see in Flex Console.
      // "label" is set here for this web app's UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'acneProne',
          value: 'Acne Prone',
          label: 'Acne Prone',
          icon: toolsIcon,
        },
        {
          key: 'sensitiveSkin',
          value: 'Sensitive Skin',
          label: 'Sensitive Skin',
          icon: toolsIcon,
        },
        {
          key: 'normalSkin',
          value: 'Normal Skin ',
          label: 'Normal Skin ',
          icon: toolsIcon,
        },
        {
          key: 'matureSkin',
          value: 'Mature Skin',
          label: 'Mature Skin',
          icon: toolsIcon,
        },
        {
          key: 'drySkin',
          value: 'Dry Skin',
          label: 'Dry Skin',
          icon: toolsIcon,
        },
        {
          key: 'combination ',
          value: 'Combination ',
          label: 'Combination',
          icon: toolsIcon,
        },
      ],
    },
  },
  {
    id: 'hairTextures',
    label: 'Hair Types',
    type: 'SelectMultipleFilter',
    group: 'secondary',
    queryParamNames: ['pub_hairTextures'],
    config: {
      // "key" is the option you see in Flex Console.
      // "label" is set here for the UI only.
      // Note: label is not added through the translation files
      // to make filter customizations a bit easier.
      options: [
        {
          key: 'protective',
          value: 'Protective',
          label: 'Protective',
          icon: toolsIcon1,
        },
        {
          key: 'extensions',
          value: 'Wigs & Extensions',
          label: 'Wigs & Extensions',
          icon: toolsIcon7,
        },

        {
          key: 'coily',
          value: 'Coily',
          label: 'Coily',
          icon: toolsIcon2,
        },
        {
          key: 'curly',
          value: 'Curly',
          label: 'Curly',
          icon: toolsIcon3,
        },
        {
          key: 'wavy',
          value: 'Wavy',
          label: 'Wavy',
          icon: toolsIcon4,
        },
        {
          key: 'straight',
          value: 'Straight',
          label: 'Straight',
          icon: toolsIcon5,
        },
        {
          key: 'baldShaved',
          value: 'Bald / Shaved',
          label: 'Bald / Shaved',
          icon: toolsIcon6,
        },
      ],
    },
  },
];

export const sortConfig = {
  // Enable/disable the sorting control in the SearchPage
  active: true,

  // Note: queryParamName 'sort' is fixed,
  // you can't change it since Flex API expects it to be named as 'sort'
  queryParamName: 'sort',

  // Internal key for the relevance option, see notes below.
  relevanceKey: 'relevance',

  // Keyword filter is sorting the results already by relevance.
  // If keyword filter is active, we need to disable sorting.
  conflictingFilters: ['keyword'],

  options: [
    { key: '', label: 'Most Relevant'},
    { key: '', label: 'Deals available' },
    { key: '', label: 'Top rated' },

    // The relevance is only used for keyword search, but the
    // parameter isn't sent to the Marketplace API. The key is purely
    // for handling the internal state of the sorting dropdown.
  ],
};
