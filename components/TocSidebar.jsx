import React, { useState, useEffect } from 'react';

const TocSidebar = ({ headerBlocks }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeSubChapter, setActiveSubChapter] = useState(null);

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const headings = document.querySelectorAll("h2, h3, h4");
        const tocList = document.getElementById("toc");
        tocList.innerHTML = ''; // Clear the existing contents of the TOC list

        headings.forEach((heading) => {
            const openLevel = parseInt(heading.tagName.substr(1));
            const titleText = heading.textContent;
            const anchor = titleText.replace(/ /g, "_");

            const tocItem = document.createElement("li");
            tocItem.classList.add("toc-item"); // Adiciona a classe CSS

            const tocLink = document.createElement("a");
            tocLink.href = `#${anchor}`;
            tocLink.textContent = titleText;
            tocLink.classList.add("toc-link"); // Adiciona a classe CSS
            tocItem.appendChild(tocLink);

            if (openLevel === 2) {
                tocItem.classList.add("h2-toc-item");
            } else if (openLevel === 3) {
                tocItem.classList.add("h3-toc-item");
            }

            tocList.appendChild(tocItem);

            heading.innerHTML = `<a id="${anchor}" href="#${anchor}">${heading.innerHTML}</a>`;
        });
    }, [headerBlocks]);

    return (
        <div>
            <div className="list-group-item">
                <nav className="bd-toc">
                    <ul id="toc" className="list-group list-group-flush mx-2 py-1"></ul>
                </nav>
            </div>
        </div>
    );
};

export default TocSidebar;