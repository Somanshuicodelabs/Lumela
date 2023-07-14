import React from 'react'
import css from './ServicesCard.module.css';
import IconCard from '../IconCard/IconCard';
import NamedLink from '../NamedLink/NamedLink';

const ServicesCard = (props) => {
    const { productImage, serviceHeading, serviceMins, servicePrice ,serviceDes,id, status} = props;
    return (
        <NamedLink name="ServiceListingPage" to={{search:`?id=${id?.uuid}`}} >
        <div className={css.productCard}>
            <div className={css.imageBox}>
                <img src={productImage} />
            </div>
            <div className={css.imageBody}>
                <h5 className={css.productBodyHeading}>{serviceHeading}</h5>
                <div className={css.productSize}>{serviceMins}</div>
                <div className={css.productSize}>{serviceDes}</div>
                <div className={css.bottomWrapper}>
                    <div className={css.productPrice}>{servicePrice}</div>
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

export default ServicesCard