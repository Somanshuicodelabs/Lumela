/////////////////////////////////////////////////////////
// Configurations related to listing.                  //
// Main configuration here is the extended data config //
/////////////////////////////////////////////////////////

// NOTE: if you want to change the structure of the data,
// you should also check src/util/configHelpers.js
// some validation is added there.

/**
 * Configuration options for listing fields (custom extended data fields):
 * - key:                           Unique key for the extended data field.
 * - scope (optional):              Scope of the extended data can be either 'public' or 'private'.
 *                                  Default value: 'public'.
 *                                  Note: listing doesn't support 'protected' scope atm.
 * - includeForListingTypes:        An array of listing types, for which the extended
 *   (optional)                     data is relevant and should be added.
 * - schemaType (optional):         Schema for this extended data field.
 *                                  This is relevant when rendering components and querying listings.
 *                                  Possible values: 'enum', 'multi-enum', 'text', 'long', 'boolean'.
 * - enumOptions (optional):        Options shown for 'enum' and 'multi-enum' extended data.
 *                                  These are used to render options for inputs and filters on
 *                                  EditListingPage, ListingPage, and SearchPage.
 * - filterConfig:                  Filter configuration for listings query.
 *    - indexForSearch (optional):    If set as true, it is assumed that the extended data key has
 *                                    search index in place. I.e. the key can be used to filter
 *                                    listing queries (then scope needs to be 'public').
 *                                    Note: Flex CLI can be used to set search index for the key:
 *                                    https://www.sharetribe.com/docs/references/extended-data/#search-schema
 *                                    Read more about filtering listings with public data keys from API Reference:
 *                                    https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
 *                                    Default value: false,
 *   - filterType:                    Sometimes a single schemaType can be rendered with different filter components.
 *                                    For 'enum' schema, filterType can be 'SelectSingleFilter' or 'SelectMultipleFilter'
 *   - label:                         Label for the filter, if the field can be used as query filter
 *   - searchMode (optional):         Search mode for indexed data with multi-enum schema.
 *                                    Possible values: 'has_all' or 'has_any'.
 *   - group:                         SearchPageWithMap has grouped filters. Possible values: 'primary' or 'secondary'.
 * - showConfig:                    Configuration for rendering listing. (How the field should be shown.)
 *   - label:                         Label for the saved data.
 *   - isDetail                       Can be used to hide detail row (of type enum, boolean, or long) from listing page.
 *                                    Default value: true,
 * - saveConfig:                    Configuration for adding and modifying extended data fields.
 *   - label:                         Label for the input field.
 *   - placeholderMessage (optional): Default message for user input.
 *   - isRequired (optional):         Is the field required for providers to fill
 *   - requiredMessage (optional):    Message for those fields, which are mandatory.
 */


import color1 from '../assets/Colours1.jpg'
import color2 from '../assets/Colours2.jpg'
import color3 from '../assets/Colours3.jpg'
import color4 from '../assets/Colours4.jpg'






export const listingFields = [
  {
    key: 'canDo',
    scope: 'public',
    schemaType: 'multi-enum',
    enumOptions: [
      { option: 'mobileCalls', label: 'Mobile Calls' },
      { option: 'houseCalls', label: 'House Calls' },

    ],
    filterConfig: {
      indexForSearch: true,
      filterType: 'SelectMultipleFilter',
      label: 'Can Do',
      group: 'primary',
    },
    showConfig: {
      label: 'Can Do',
      isDetail: true,
    },
    saveConfig: {
      label: 'Can Do',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a category.',
    },
  },

  {
    key: 'skinTones',
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 'color1', label: 'color1' },
      { option: 'color2', label: 'color2' },
      { option: 'color3', label: 'color3' },
      { option: 'color4', label: 'color4' },

    ],
    filterConfig: {
      indexForSearch: true,
      label: 'SkinTones',
      group: 'secondary',
    },
    showConfig: {
      label: 'SkinTones',
      isDetail: true,
    },
    saveConfig: {
      label: 'SkinTones',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a skinTones.',
    },
  },

  {
    key: 'skinTypes',
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 'acneProne', label: 'Acne Prone' },
      { option: 'sensitiveSkin', label: 'Sensitive Skin' },
      { option: 'normalSkin', label: 'Normal Skin' },
      { option: 'matureSkin', label: 'Mature Skin' },
      { option: 'drySkin', label: 'Dry Skin' },
      { option: 'combination', label: 'Combination' },

    ],
    filterConfig: {
      indexForSearch: true,
      label: 'SkinTypes',
      group: 'secondary',
    },
    showConfig: {
      label: 'SkinTypes',
      isDetail: true,
    },
    saveConfig: {
      label: 'SkinTypes',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a SkinTypes.',
    },
  },

  {
    key: 'hairTexture',
    scope: 'public',
    schemaType: 'enum',
    enumOptions: [
      { option: 'protective', label: 'Protective ' },
      { option: 'extensions', label: 'Wigs & Extensions' },
      { option: 'coily', label: 'Coily ' },
      { option: 'curly', label: 'Curly ' },
      { option: 'wavy', label: 'Wavy' },
      { option: 'straight', label: 'Straight' },
      { option: 'baldShaved', label: 'Bald / Shaved' },

    ],
    filterConfig: {
      indexForSearch: true,
      label: 'Hair Texture',
      group: 'secondary',
    },
    showConfig: {
      label: 'Hair Texture',
      isDetail: true,
    },
    saveConfig: {
      label: 'Hair Texture',
      placeholderMessage: 'Select an option…',
      isRequired: true,
      requiredMessage: 'You need to select a hairTexture.',
    },
  },






  // {
  //   key: 'accessories',
  //   scope: 'public',
  //   schemaType: 'multi-enum',
  //   enumOptions: [
  //     { option: 'bell', label: 'Bell' },
  //     { option: 'lights', label: 'Lights' },
  //     { option: 'lock', label: 'Lock' },
  //     { option: 'mudguard', label: 'Mudguard' },
  //   ],
  //   filterConfig: {
  //     indexForSearch: true,
  //     label: 'Accessories',
  //     searchMode: 'has_all',
  //     group: 'secondary',
  //   },
  //   showConfig: {
  //     label: 'Accessories',
  //   },
  //   saveConfig: {
  //     label: 'Accessories',
  //     placeholderMessage: 'Select an option…',
  //     isRequired: false,
  //   },
  // },



  // // An example of how to use transaction type specific custom fields and private data.
  // {
  //   key: 'note',
  //   scope: 'public',
  //   includeForListingTypes: ['product-selling'],
  //   schemaType: 'text',
  //   showConfig: {
  //     label: 'Extra notes',
  //   },
  //   saveConfig: {
  //     label: 'Extra notes',
  //     placeholderMessage: 'Some public extra note about this bike...',
  //   },
  // },
  // {
  //   key: 'privatenote',
  //   scope: 'private',
  //   includeForListingTypes: ['daily-booking'],
  //   schemaType: 'text',
  //   saveConfig: {
  //     label: 'Private notes',
  //     placeholderMessage: 'Some private note about this bike...',
  //   },
  // },
];

///////////////////////////////////////////////////////////////////////
// Configurations related to listing types and transaction processes //
///////////////////////////////////////////////////////////////////////

// A presets of supported listing configurations
//
// Note 1: With first iteration of hosted configs, we are unlikely to support
//         multiple listing types, even though this template has some
//         rudimentary support for it.
// Note 2: transaction type is part of listing type. It defines what transaction process and units
//         are used when transaction is created against a specific listing.

/**
 * Configuration options for listing experience:
 * - listingType:     Unique string. This will be saved to listing's public data on
 *                    EditListingWizard.
 * - label            Label for the listing type. Used as microcopy for options to select
 *                    listing type in EditListingWizard.
 * - transactionType  Set of configurations how this listing type will behave when transaction is
 *                    created.
 *   - process          Transaction process.
 *                      The process must match one of the processes that this client app can handle
 *                      (check src/util/transaction.js) and the process must also exists in correct
 *                      marketplace environment.
 *   - alias            Valid alias for the aforementioned process. This will be saved to listing's
 *                      public data as transctionProcessAlias and transaction is initiated with this.
 *   - unitType         Unit type is mainly used as pricing unit. This will be saved to
 *                      transaction's protected data.
 *                      Recommendation: don't use same unit types in completely different processes
 *                      ('item' sold should not be priced the same as 'item' booked).
 * - stockType        This is relevant only to listings with product-selling listing type.
 *                    If set to 'oneItem', stock management is not showed and the listing is
 *                    considered unique (stock = 1).
 *                    Possible values: 'oneItem' and 'multipleItems'.
 *                    Default: 'multipleItems'.
 */

export const listingTypes = [
  {
    listingType: 'daily-booking',
    label: 'Daily booking',
    transactionType: {
      process: 'default-booking',
      alias: 'default-booking/release-1',
      unitType: 'day',
    },
  },
  // // Here are some examples for other listingTypes
  // // TODO: SearchPage does not work well if both booking and product selling are used at the same time
  // {
  //   listingType: 'nightly-booking',
  //   label: 'Nightly booking',
  //   transactionType: {
  //     process: 'default-booking',
  //     alias: 'default-booking/release-1',
  //     unitType: 'night',
  //   },
  // },
  // {
  //   listingType: 'hourly-booking',
  //   label: 'Hourly booking',
  //   transactionType: {
  //     process: 'default-booking',
  //     alias: 'default-booking/release-1',
  //     unitType: 'hour',
  //   },
  // },
  // {
  //   listingType: 'product-selling',
  //   label: 'Sell bicycles',
  //   transactionType: {
  //     process: 'default-purchase',
  //     alias: 'default-purchase/release-1',
  //     unitType: 'item',
  //   },
  //   stockType: 'multipleItems',
  // },
];

// SearchPage can enforce listing query to only those listings with valid listingType
// However, it only works if you have set 'enum' type search schema for the public data fields
//   - listingType
//
//  Similar setup could be expanded to 2 other extended data fields:
//   - transactionProcessAlias
//   - unitType
//
// Read More:
// https://www.sharetribe.com/docs/how-to/manage-search-schemas-with-flex-cli/#adding-listing-search-schemas
export const enforceValidListingType = false;
