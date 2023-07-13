import React from 'react';
import { func, node, object, shape, string } from 'prop-types';
import classNames from 'classnames';

import Field, { hasDataInFields } from '../../Field';
import BlockContainer from '../BlockContainer';

import css from './BlockDefault.module.css';
import lomelaVideo from '../../../../assets/video/Lumela_video.mp4';
import ReactMuxPlayer from '../../../../components/ReactMuxPlayer/ReactMuxPlayer';
import { Button } from '../../../../components';
import IconLocation from '../../../../components/IconLocation/IconLocation';
import MainPanelLanding from '../../../SearchPage/MainPanelLanding';
// import IconSearchGlass from '../../../../components/IconSearchGlass/IconSearchGlass';

const FieldMedia = props => {
  const { className, media, sizes, options } = props;
  const hasMediaField = hasDataInFields([media], options);
  return hasMediaField ? (
    <div className={classNames(className, css.media)}>
      <Field data={media} sizes={sizes} options={options} />
    </div>
  ) : null;
};

const BlockDefault = props => {
  const {
    blockId,
    className,
    rootClassName,
    mediaClassName,
    textClassName,
    ctaButtonClass,
    title,
    text,
    callToAction,
    media,
    responsiveImageSizes,
    options,
    sectionId,
    isDrawerOpen,
    authStep,
    redirectRoute,
    onManageToggleDrawer,
    publicData,
  } = props;
  const classes = classNames(
    rootClassName || css.root,
    className,
    blockId === 'mobile-image-section' && css.joinLumelaMobile
  );
  const hasTextComponentFields = hasDataInFields([title, text, callToAction], options);
  const settings = {
    fluid: false,
    width: 478,
    height: 416,
    videos: [lomelaVideo],
  };
  return (
    <BlockContainer id={blockId} className={classes}>
      {sectionId == 'better-advertising' && blockId == 'block2' ? (
        <div className={css.videoContainer}>
          <ReactMuxPlayer settings={settings} />
        </div>
      ) : (
        <FieldMedia
          media={media}
          sizes={responsiveImageSizes}
          className={classNames(mediaClassName, props?.additionalClass)}
          options={options}
        />
      )}
      {hasTextComponentFields ? (
        <div className={classNames(textClassName, css.text, props?.additionalClass)}>
          <Field data={title} options={options} />
          {sectionId == 'handle-admin-market' && blockId == 'block2' ? (
            <>
              <Field data={text} options={options} />
              <input type="text" placeholder="Email*" />
            </>
          ) : (
            <Field data={text} options={options} />
          )}
          {blockId === 'sign-up' ? (
            <Button
              className={css.signUpButton}
              onClick={() => options?.onManageToggleDrawer(false)}
            >
              Sign-up Now
            </Button>
          ) : blockId == 'find-out-more' ? (
            <a className={css.findMore} href="#better-advertising">
              Find out more
            </a>
          ) : (
            <Field data={callToAction} className={ctaButtonClass} options={options} />
          )}
          {/* {listings?.map((item) => (
          <div>{item?.attributes?.publicData?.businessName}</div>))} */}
        
        </div>
      ) : null}
        {/* <MainPanelLanding/> */}
    </BlockContainer>
  );
};

const propTypeOption = shape({
  fieldComponents: shape({ component: node, pickValidProps: func }),
});

BlockDefault.defaultProps = {
  className: null,
  rootClassName: null,
  mediaClassName: null,
  textClassName: null,
  ctaButtonClass: null,
  title: null,
  text: null,
  callToAction: null,
  media: null,
  responsiveImageSizes: null,
  options: null,
};

BlockDefault.propTypes = {
  blockId: string.isRequired,
  className: string,
  rootClassName: string,
  mediaClassName: string,
  textClassName: string,
  ctaButtonClass: string,
  title: object,
  text: object,
  callToAction: object,
  media: object,
  responsiveImageSizes: string,
  options: propTypeOption,
};

export default BlockDefault;
