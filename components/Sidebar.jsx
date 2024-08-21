import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getFromCache, saveToCache } from '../db/FetchApiOffline'; // Importe as funções de cache

const Sidebar = ({ isOffcanvasOpen, setIsOffcanvasOpen, onSelectCollection, activeCollection, setActiveCollection }) => {
    const [collections, setCollections] = useState([]);
    const [activeChapter, setActiveChapter] = useState(null);
    const [showSummary, setShowSummary] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    var LogoIFEmbrapa = require('../public/logo-if-embrapa.png');

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                // Verifique se o window está definido
                if (typeof window !== 'undefined') {
                    // Tente obter os dados do cache
                    const cachedCollections = await getFromCache('collections');
                    if (cachedCollections) {
                        setCollections(cachedCollections);
                    }
                }

                // Faça a requisição à API para obter os dados mais recentes
                const responses = await Promise.all([
                    axios.get('https://api-cartilha-teste2.onrender.com/api/pesticida-abelhas?populate=*'),
                    axios.get('https://api-cartilha-teste2.onrender.com/api/boa-pratica-agroes?populate=*'),
                    axios.get('https://api-cartilha-teste2.onrender.com/api/boa-pratica-apicolas?populate=*'),
                    axios.get('https://api-cartilha-teste2.onrender.com/api/boa-pratica-comunicacaos?populate=*')
                ]);

                const collectionsData = [
                    { id: 1, title: 'Pesticidas e abelhas', data: responses[0].data },
                    { id: 2, title: 'Boas práticas agrícolas', data: responses[1].data },
                    { id: 3, title: 'Boas práticas apícolas', data: responses[2].data },
                    { id: 4, title: 'Boas práticas de comunicação', data: responses[3].data }
                ];

                setCollections(collectionsData);

                // Salve os dados no cache
                if (typeof window !== 'undefined') {
                    await saveToCache('collections', collectionsData);
                }

                // Verificar se a coleção ativa e o capítulo ativo estão definidos
                if (collectionsData.length > 0 && !activeCollection && !activeChapter) {
                    const firstCollection = collectionsData[0];
                    setActiveCollection(firstCollection.id);
                    setActiveChapter(firstCollection.data.data[0].id);
                    router.push(`#capitulo_${firstCollection.data.data[0].id}`, undefined, { shallow: true });
                    onSelectCollection(firstCollection.id); // Notifica o pai sobre a seleção
                }
            } catch (error) {
                console.error('Erro ao buscar as coleções', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollections();
    }, [activeCollection, activeChapter, onSelectCollection, router]);

    const closeSidebar = () => {
        const sidebarMenu = document.getElementById("sidebarMenu");
        if (sidebarMenu) {
          sidebarMenu.classList.remove("show");
        }
        setIsOffcanvasOpen(false);
    }

    const updateUrlWithCollection = (collectionId) => {
        const url = new URL(window.location);
        url.hash = `#collection_${collectionId}`;
        window.history.pushState({}, '', url);
    };

    const handleToggle = useCallback((collectionId) => {
        setActiveCollection(activeCollection === collectionId ? null : collectionId);
        setActiveChapter(null); // Resetar capítulo ativo ao mudar a coleção ativa
        updateUrlWithCollection(collectionId); // Atualiza a URL com a coleção ativa
    }, [activeCollection]);

    const handleItemClick = useCallback((collectionId) => {
        handleToggle(collectionId);
    }, [handleToggle]);

    const handleChapterClick = useCallback((collectionId, chapterId) => {
        onSelectCollection(collectionId); // Notifica o pai sobre a seleção
        setActiveChapter(chapterId);
        router.push(`#collection_${collectionId}#capitulo_${chapterId}`, undefined, { shallow: true });
        closeSidebar();
    }, [onSelectCollection, router]);

    const handleSubChapterClick = useCallback((collectionId, subChapterId) => {
        router.push(`/collection/${collectionId}/#subcapitulo_${subChapterId}`, undefined, { shallow: true });
        closeSidebar();
    }, [router]);

    const toggleSubChapters = useCallback((chapterId) => {
        setActiveChapter(activeChapter === chapterId ? null : chapterId);
    }, [activeChapter]);

    // Função para ordenar capítulos pelo id
    const sortChapters = useCallback((chapters) => {
        return chapters.sort((a, b) => a.id - b.id);
    }, []);

    const sortedCollections = useMemo(() => {
        return collections.map(collection => ({
            ...collection,
            data: {
                ...collection.data,
                data: sortChapters(collection.data.data)
            }
        }));
    }, [collections, sortChapters]);

    return (
        <div>
            <nav id="sidebarMenu" className={`collapse d-lg-block sidebar bg-white thin-scrollbar ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1">
                <div className="position-sticky">
                    <div id="summary" className="list-group list-group-flush mt-2 py-2 menu_SIkG" style={{ display: showSummary ? 'block' : 'none' }}>
                        <div className='logo-container-fixed'>
                            <div className="logo-container d-flex align-items-center justify-content-between">
                                <Link href="/home">
                                    <Image className="img-sidebar-top mx-3" src={LogoIFEmbrapa} alt="logo Embrapa com letras em azul com um símbolo verde, sendo que as letras em cima do símbolo são brancas" width="45%" height={46} priority/>
                                </Link>
                                <button id="btn-close-sidebar" type="button" className="btn-close btn-close-dark btn-close-cap" aria-label="Close" onClick={() => { setIsOffcanvasOpen(false); setShowSummary(true); }}></button>
                            </div>
                        </div>
                        <hr className="featurette-divider line-menu"></hr>
                        <div>
                            <div className="mt-1" style={{marginBottom: '8px'}}>
                                <a href='/IntroPage' className="d-flex align-items-center" style={{padding: '0.4rem 1rem', backgroundColor: '#0000000d', fontWeight: '500'}}>Introdução</a>
                            </div>
                            {isLoading ? (
                                <div className="list-group-item">Carregando...</div>
                            ) : (
                                sortedCollections.map((collection) => (
                                    <div key={collection.id}>
                                        <p 
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center dropdown-background ${activeCollection === collection.id ? '' : 'collapsed'}`}
                                            onClick={() => handleItemClick(collection.id)}
                                            style={{cursor: 'pointer', marginBottom: '10px'}}
                                        >
                                            <span className="w-100 text-primary" style={{fontWeight: '500'}}>{collection.title}</span>{' '}
                                            <i 
                                                className={`fas fa-chevron-${activeCollection === collection.id ? 'down' : 'right'} 
                                                ${activeCollection === collection.id ? 'icon-deg-active' : 'icon-deg-right'}`}
                                            >                                                
                                            </i>
                                        </p>
                                        {activeCollection === collection.id && (
                                            <ul className="list-group list-group-flush mx-1">
                                                {collection.data.data.map((item) => (
                                                <li 
                                                    key={item.id} 
                                                    className={`list-group-item py-2 ${item.attributes.subnivel && item.attributes.subnivel.length > 0 ? 'chapter-with-subchapters' : ''}`}
                                                    style={{ cursor: 'pointer', marginBottom: '8px', fontSize: '15px' }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <a 
                                                            href={`#collection_${collection.id}#capitulo_${item.id}`}
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Previne o comportamento padrão do link
                                                                handleChapterClick(collection.id,item.id); // Navega diretamente para o capítulo
                                                            }}
                                                            className="d-flex align-items-center" 
                                                            style={{ textDecoration: 'none', color: 'inherit' }} // Estilo opcional para o link
                                                        >
                                                            {item.attributes.titulo}
                                                        </a>
                                                    </div>
                                                </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default React.memo(Sidebar);