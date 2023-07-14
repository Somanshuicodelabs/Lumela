import React from 'react'
import css from './ProductsCard.module.css';
import IconCard from '../IconCard/IconCard';
import NamedLink from '../NamedLink/NamedLink';

const ProductsCard = (props) => {
    const { productImage, productHeading, productSize, productPrice ,id, status} = props;
    console.log('status :>> ', status);
    return (
        <NamedLink name="ProductListingPage" to={{search:`?id=${id?.uuid}`}} >
        <div className={css.productCard}>
            <div className={css.imageBox}>
                <img src={productImage} />
            </div>
            <div className={css.imageBody}>
                <h5 className={css.productBodyHeading}>{productHeading}</h5>
                <div className={css.productSize}>{productSize}</div>
                <div className={css.bottomWrapper}>
                    <div className={css.productPrice}>{productPrice}</div>
                    <div className={css.productDotIcon}>
                        <IconCard brand="dots" />
                    </div>
                </div>
                <div>{status}</div>
            </div>
        </div>
        </NamedLink>
    )
}

export default ProductsCard