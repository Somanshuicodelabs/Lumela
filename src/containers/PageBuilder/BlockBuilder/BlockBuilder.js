import React from 'react';
import { arrayOf, func, node, oneOf, shape, string } from 'prop-types';
import Collapsible from 'react-collapsible';
import css from './BlockBuilder.module.css';
import BlockDefault from './BlockDefault';
// Block components

///////////////////////////////////////////
// Mapping of block types and components //
///////////////////////////////////////////
// const defaultBlockComponents =  { defaultBlock: { component: <BlockDefault/> }}

////////////////////
// Blocks builder //
////////////////////

const BlockBuilder = props => {
  const {
    blocks,
    options,
    id,
    isDrawerOpen,
    authStep,
    redirectRoute,
    onManageToggleDrawer,
    ...otherProps
  } = props;

  // Extract block & field component mappings from props
  // If external mapping has been included for fields
  // E.g. { h1: { component: MyAwesomeHeader } }
  const { blockComponents, fieldComponents } = options || {};
  const blockOptionsMaybe = fieldComponents ? { options: { fieldComponents } } : {};

  // If there's no block, we can't render the correct block component
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Selection of Block components
  // Combine component-mapping from props together with the default one:

  // const Block = <BlockDefault isDrawerOpen={isDrawerOpen}
  // authStep={authStep}
  // redirectRoute={redirectRoute}
  // onManageToggleDrawer={onManageToggleDrawer}/>
  const defaultBlockComponents = { defaultBlock: { component: BlockDefault } };
  const components = { ...defaultBlockComponents, ...blockComponents };

  return (
    <>
      {id == 'faq'
        ? blocks.map(block => {
            const config = components[block.blockType];
            const Block = config?.component;
            if (Block) {
              return (
                <div className={css.faqContent}>
                  <Collapsible
                    trigger={
                      <>
                        {' '}
                        <h1>{block.title.content}</h1>
                        <svg
                          width="31"
                          height="30"
                          viewBox="0 0 31 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <ellipse cx="15.5" cy="15" rx="15.5" ry="15" fill="#FAA05A" />
                          <line x1="15.5" y1="5" x2="15.5" y2="25" stroke="#303030" />
                          <line x1="5" y1="15.5" x2="26" y2="15.5" stroke="#303030" />
                        </svg>
                      </>
                    }
                  >
                    <h6>Details</h6>
                  </Collapsible>

                  {/* <Block key={block.blockId} {...block} {...blockOptionsMaybe} {...otherProps} />  */}
                </div>
              );
            } else {
              // If the block type is unknown, the app can't know what to render
              console.warn(`Unknown block type (${block.blockType}) detected.`);
              return null;
            }
          })
        : id == 'people-saying'
        ? blocks.map(block => {
            const config = components[block.blockType];
            const Block = config?.component;
            if (Block) {
              return (
                <Block
                  key={block.blockId}
                  {...block}
                  {...blockOptionsMaybe}
                  {...otherProps}
                  isDrawerOpen={isDrawerOpen}
                  authStep={authStep}
                  redirectRoute={redirectRoute}
                  onManageToggleDrawer={onManageToggleDrawer}
                  options={options}
                />
              );
            } else {
              // If the block type is unknown, the app can't know what to render
              console.warn(`Unknown block type (${block.blockType}) detected.`);
              return null;
            }
          })
        : blocks.map(block => {
            const config = components[block.blockType];
            const Block = config?.component;
            if (Block) {
              return (
                <Block
                  key={block.blockId}
                  {...block}
                  {...blockOptionsMaybe}
                  {...otherProps}
                  isDrawerOpen={isDrawerOpen}
                  authStep={authStep}
                  redirectRoute={redirectRoute}
                  onManageToggleDrawer={onManageToggleDrawer}
                  options={options}
                />
              );
            } else {
              // If the block type is unknown, the app can't know what to render
              console.warn(`Unknown block type (${block.blockType}) detected.`);
              return null;
            }
          })}
    </>
  );
};

const propTypeBlock = shape({
  blockId: string.isRequired,
  blockType: oneOf(['defaultBlock']).isRequired,
  // Plus all kind of unknown fields.
  // BlockBuilder doesn't really need to care about those
});

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
  blockComponents: shape({ component: node }),
});

BlockBuilder.defaultProps = {
  blocks: [],
  options: null,
  responsiveImageSizes: null,
  className: null,
  rootClassName: null,
  mediaClassName: null,
  textClassName: null,
  ctaButtonClass: null,
};

BlockBuilder.propTypes = {
  blocks: arrayOf(propTypeBlock),
  options: propTypeOption,
  responsiveImageSizes: string,
  className: string,
  rootClassName: string,
  mediaClassName: string,
  textClassName: string,
  ctaButtonClass: string,
};

export default BlockBuilder;
