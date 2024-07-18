import React, { useState } from 'react';

const Dropdown = ({ title, items, activeTitle, handleTitleClick, setIsOffcanvasOpen }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleToggle = (index) => {
        setActiveDropdown(index === activeDropdown ? null : index);
    };

    return (
        <div>
            {items.length > 0 ? (
                items.map((item, index) => (
                    <div key={item.id}>
                        <a
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ripple ${
                                activeDropdown === index ? '' : 'collapsed'
                            }`}
                            onClick={() => handleToggle(index)}
                        >
                            <span className="w-100 text-primary">{title}</span>{' '}
                            <i className={`fas fa-chevron-${activeDropdown === index ? 'down' : 'right'} icon-deg`}></i>
                        </a>
                        <ul
                            id={`collapseExample${index}`}
                            className={`list-group list-group-flush mx-2 py-1 ${activeDropdown === index ? 'show' : 'collapse'}`}
                        >
                            {items.map((subItem) => (
                                <li
                                    key={subItem.id}
                                    className={`list-group-item py-2 ${activeTitle === subItem.id ? 'active' : ''}`}
                                    onClick={() => { handleTitleClick(subItem.id); setIsOffcanvasOpen(false); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <a
                                        href={`#capitulo_${subItem.id}`}
                                        className={activeTitle === subItem.id ? 'active-link-summary' : ''}
                                    >
                                        {subItem.attributes.titulo}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p className="d-flex justify-content-center" style={{ marginTop: 20 }}>Carregando dados...</p>
            )}
        </div>
    );
};

export default Dropdown;
