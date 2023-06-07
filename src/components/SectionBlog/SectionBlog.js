import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import css from './SectionBlog.module.css';
import './react-tab.css';
// import IconRightArrow from '../IconRightArrow/IconRightArrow';
// import IconReviewStar from '../IconReviewStar/IconReviewStar';
import categoryImg1 from '../../assets/blog1.jpg';
import categoryImg2 from '../../assets/blog2.jpg';
import categoryImg3 from '../../assets/blog3.jpg';
import Logo from '../Logo/Logo';
import { useDispatch, useSelector } from 'react-redux';
import { strapiBlogs } from '../../containers/LandingPage/LandingPage.duck';
export default function SectionBlog(props) {
  const { rootClassName, className } = props;
  const classes = classNames(rootClassName || css.root, className);

  const [toggleState, setToggleState] = useState({ index: 1, tabName: 'MENS' });

  const dispatch = useDispatch();
 
  const { landing_page_data_request, landing_page_data } = useSelector(state => state.landingPageReducer);
  const toggleTab = (params) => {
    const index = params?.index;
    const tabName = params?.tabName
    setToggleState({ index, tabName });
  };


  function callback(e) {
    console.log(e);
  }
  useEffect(() => {
    dispatch(strapiBlogs(toggleState.tabName)).then(res => res)
  }, [toggleState.tabName])

  return (
    <div className={classes}>
      <div className={css.fixedWidthContainer}>
        <div className={css.horizontalTabs}>
          <div className={css.tabWrapper}>
            <div className={css.tabsContainer}>
              <button
                className={toggleState.index === 1 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab({ index: 1, tabName: 'MENS' })}
              >
                MENS
              </button>
              <button
                className={toggleState.index === 2 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab({ index: 2, tabName: "HAIR" })}
              >
                Hair
              </button>
              <button
                className={toggleState.index === 3 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab({ index: 3, tabName: 'BEAUTY' })}
              >
                BEAUTY
              </button>
              {/* <button
                className={toggleState === 4 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab(4)}
              >
                WELLNESS
              </button> */}
              <button
                className={toggleState.index === 5 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab({ index: 5, tabName: 'TREATMENTS' })}
              >
                TREATMENTS
              </button>
              {/* <button
                className={toggleState === 6 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab(6)}
              >
                GUIDES
              </button>
              <button
                className={toggleState === 7 ? 'tabs active-tabs' : 'tabs'}
                onClick={() => toggleTab(7)}
              >
                FOOD
              </button> */}
            </div>
          </div>

          <div className={toggleState.index == 1 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
              {landing_page_data?.length && landing_page_data.map((item) => (
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={item.attributes.thumbnailImage.data.attributes.url} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>{item?.attributes?.thumbnailTitle}</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        {item?.attributes?.thumbnailDescription}
                      </span>
                    </p>
                  </div>
                </div>
              </div>))}
            </div>
          </div>
          <div className={toggleState.index === 2 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
            {landing_page_data?.length && landing_page_data.map((item) => (
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={item.attributes.thumbnailImage.data.attributes.url} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>{item?.attributes?.thumbnailTitle}</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                      {item?.attributes?.thumbnailDescription}
                      </span>
                    </p>
                  </div>
                </div>
              </div>))}
            </div>
          </div>
          <div className={toggleState.index === 3 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
            {landing_page_data?.length && landing_page_data.map((item) => (
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={item.attributes.thumbnailImage.data.attributes.url} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>{item?.attributes?.thumbnailTitle}</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                      {item?.attributes?.thumbnailDescription}
                      </span>
                    </p>
                  </div>
                </div>
              </div>))}
            </div>
          </div>
          {/* <div className={toggleState === 4 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg1} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>DO you need SLEEP?</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg2} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>BODY NEUTRALITY</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg3} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>MENTAL HEALTH</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className={toggleState.index === 5 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
            {landing_page_data?.length && landing_page_data.map((item) => (
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={item.attributes.thumbnailImage.data.attributes.url} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>{item?.attributes?.thumbnailTitle}</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                      {item?.attributes?.thumbnailDescription}
                      </span>
                    </p>
                  </div>
                </div>
              </div>))}
            </div>
          </div>
          <div className={toggleState === 6 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg1} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>DO you need SLEEP?</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg2} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>BODY NEUTRALITY</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg3} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>MENTAL HEALTH</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={toggleState === 7 ? 'content  active-content' : 'content'}>
            <div className={css.categoriesBlock}>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg1} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>DO you need SLEEP?</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg2} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>BODY NEUTRALITY</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className={css.category}>
                <div className={css.categoryImg}>
                  <span className={css.border}></span>
                  <img src={categoryImg3} alt="category" />
                </div>
                <div className={css.categoryInfo}>
                  <div className={css.categoryHead}>
                    <h2>MENTAL HEALTH</h2>
                  </div>
                  <div className={css.categoryBody}>
                    <p className={css.description}>
                      <span className={css.pattern}></span>
                      <span className={css.text}>
                        This is a blurb about the blog article to read about. This will pull them
                        in...
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
