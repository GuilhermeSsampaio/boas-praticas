import React, { useState, useEffect } from 'react';

const TableOfContents = ({ subchapters, onClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="container-xxl bd-gutter mt-3 my-md-4 bd-layout">
            <main className="bd-main order-1 bd-toc-container thin-scrollbar-toc">
                <div className="bd-toc mt-3 mb-5 my-lg-0 mb-lg-5 px-sm-1 text-body-secondary">
                    <button
                        className="btn btn-link p-lg-0 mb-2 mb-lg-0 text-decoration-none bd-toc-toggle d-lg-none full-width-btn"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#tocContents"
                        aria-expanded={isExpanded}
                        aria-controls="toc"
                        onClick={toggleContent}
                    >
                        Nessa página{" "}
                        <i
                            className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                            style={{ fontSize: '18px' }}
                        ></i>
                    </button>
                    <div className={`table-of-contents__left-border collapse bd-toc-collapse d-lg-block ${isExpanded ? 'show' : ''}`} id="tocContents">
                        <nav className="bd-toc">
                            <ul id="toc" className="list-unstyled">
                                {subchapters.map(sub => (
                                    <li key={sub.id} className="toc-chapter">
                                        <a href={`#${sub.id}`} onClick={(e) => {
                                            e.preventDefault();
                                            onClick(sub.id);
                                        }}>
                                            {sub.titulo_secao}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TableOfContents;
