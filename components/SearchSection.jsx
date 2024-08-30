// components/SearchSection.jsx
import React, { useState } from 'react';
import { SearchBar } from "./SearchBar.jsx";
import { SearchResultsList } from "./SearchResultsList.jsx";

export const SearchSection = ({ onSelectCollection, setActiveCollection, setActiveChapter, activeCollection }) => {
    const [results, setResults] = useState([]);

    const handleCloseResults = () => {
        setResults([]);
    };

    return (
        <>
            <div className="hide-form-search2">
                <form className="d-flex rounded-pill position-relative first-form-search" role="search">
                    <div className="search-bar-container p-1">
                        <SearchBar setResults={setResults} />
                        {results.length > 0 && (
                            <SearchResultsList
                                results={results}
                                handleCloseResults={handleCloseResults}
                                onSelectCollection={onSelectCollection}
                                setActiveCollection={setActiveCollection}
                                setActiveChapter={setActiveChapter}
                                activeCollection={activeCollection}
                            />
                        )}
                    </div>
                </form>
            </div>
            <form className="d-flex rounded-pill position-relative" role="search">
                <div className="input-group hide-form-search">
                    <div className="search-bar-container">
                        <SearchBar setResults={setResults} />
                        {results.length > 0 && (
                            <SearchResultsList
                                results={results}
                                handleCloseResults={handleCloseResults}
                                onSelectCollection={onSelectCollection}
                                setActiveCollection={setActiveCollection}
                                setActiveChapter={setActiveChapter}
                                activeCollection={activeCollection}
                            />
                        )}
                    </div>
                </div>
            </form>
        </>
    );
};

export default SearchSection;
