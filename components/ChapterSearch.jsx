import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';

const ChapterSearch = ({ collections, onSelectCollection, closeSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);
    console.log(collections);


    const filteredChapters = useCallback(() => {
        if (!searchQuery) return [];
        return collections.flatMap((collection) =>
            collection.data.data
                .filter((chapter) =>
                    chapter.attributes.titulo.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((chapter) => ({
                    collectionId: collection.id,
                    chapterId: chapter.id,
                    title: chapter.attributes.titulo,
                    collectionTitle: collection.title,
                }))
        );
    }, [collections, searchQuery]);

    const handleChapterClick = useCallback(
        (collectionId, chapterId) => {
            onSelectCollection(collectionId); // Notifica o pai sobre a seleção
            router.push(`#collection_${collectionId}#capitulo_${chapterId}`, undefined, { shallow: true });
            closeSidebar();
            setSearchQuery(''); // Limpa a busca após a seleção
        },
        [onSelectCollection, router, closeSidebar]
    );

    return (
        <div className="chapter-search mt-3 mx-2">
            <input
                type="text"
                placeholder="Pesquisar capítulos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control mb-2"
            />
            {searchQuery && (
                <ul className="list-group">
                    {filteredChapters().map((item) => (
                        <li
                            key={`${item.collectionId}-${item.chapterId}`}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleChapterClick(item.collectionId, item.chapterId)}
                            style={{ cursor: 'pointer' }}
                        >
                            <strong>{item.title}</strong>
                            <br />
                            <small>{item.collectionTitle}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default React.memo(ChapterSearch);
