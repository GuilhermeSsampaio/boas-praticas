import React, { useState, useEffect } from 'react';

const BreadcrumbsItem = ({ displayedTitle }) => {
    const [charLimit, setCharLimit] = useState(101);

    useEffect(() => {
        const updateCharLimit = () => {
            setCharLimit(window.innerWidth <= 440 ? 30 : 101);
        };

        window.addEventListener('resize', updateCharLimit);
        updateCharLimit(); // Atualiza o limite inicial

        return () => window.removeEventListener('resize', updateCharLimit);
    }, []);

    return (
        <li className="breadcrumbs__item breadcrumbs__item--active">
            <span className="breadcrumbs__link" itemProp="name">
                {displayedTitle.length > charLimit ? `${displayedTitle.substring(0, charLimit)}...` : displayedTitle}
            </span>
            <meta itemProp="position" content="2" />
        </li>
    );
};

export default BreadcrumbsItem;
