import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../public/logo.svg';
import TextCapitulos from './TextCapitulos';
import Sidebar from './Sidebar.jsx';
import BreadcrumbsItem from './BreadCrumbsItem.jsx';
import { Footer } from './Footer.jsx';
import { useMemo, useCallback } from 'react';
import ChapterSearch from './ChapterSearch'; // Importar ChapterSearch

export const Capitulos = () => {
    var LogoIF = require('../public/ifms-dr-marca-2015.png');
    var LogoEmbrapa = require('../public/logo-embrapa-400.png');
    const router = useRouter();
    const { asPath } = router;
    const [results, setResults] = useState([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [data, setData] = useState([]);
    const [activeTitle, setActiveTitle] = useState(null);
    const [currentCollection, setCurrentCollection] = useState(null);
    const [activeCollection, setActiveCollection] = useState(null);
    const [isChapterLoading, setIsChapterLoading] = useState(false);
    const [collectionsData, setCollectionsData] = useState({});
    const [collections, setCollections] = useState([]); // Adicionar estado para coleções

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
    const handleToggleBackDrop = () => {
        setIsOffcanvasOpen((prevState) => !prevState);
    };

    const handleCloseResults = () => {
        setResults([]);
    };

    const fetchCapitulosRef = useRef(null); // Create a ref to store the fetch function

    useEffect(() => {
        // Cleanup function to cancel previous fetch requests
        return () => {
            if (fetchCapitulosRef.current) {
                fetchCapitulosRef.current.abort();
            }
        };
    }, []);

    const extractChapterNumberFromAnchor = (path) => {
        const match = path.match(/#capitulo_(\d+)/);
        return match ? parseInt(match[1]) : null;
    };
    const fetchCollectionsRef = useRef(null); // Create a ref to store the fetch function

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                fetchCollectionsRef.current = new AbortController(); // Create a new AbortController for each fetch

                const urls = [
                    'https://api-boas-praticas.onrender.com/api/pesticida-abelhas?populate=*',
                    'https://api-boas-praticas.onrender.com/api/boa-pratica-agricolas',
                    'https://api-boas-praticas.onrender.com/api/boa-pratica-apicolas?populate=*',
                    'https://api-boas-praticas.onrender.com/api/boa-pratica-de-comunicacaos'
                ];

                const responses = await Promise.all(
                    urls.map(url => fetch(url, { signal: fetchCollectionsRef.current.signal }).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    }))
                );

                const collectionsData = [
                    { id: 1, title: 'Pesticidas e abelhas', data: responses[0] },
                    { id: 2, title: 'Boas práticas agrícolas', data: responses[1] },
                    { id: 3, title: 'Boas práticas apícolas', data: responses[2] },
                    { id: 4, title: 'Boas práticas de comunicação', data: responses[3] }
                ];

                setCollections(collectionsData);

                // Verificar se a coleção ativa e o capítulo ativo estão definidos
                if (collectionsData.length > 0 && !activeCollection && !activeChapter) {
                    const firstCollection = collectionsData[0];
                    setActiveCollection(firstCollection.id);
                    setActiveChapter(firstCollection.data.data[0].id);
                    router.push(`#capitulo_${firstCollection.data.data[0].id}`, undefined, { shallow: true });
                    onSelectCollection(firstCollection.id); // Notifica o pai sobre a seleção
                }
            } catch (error) {
                if (error.name !== 'AbortError') { // Ignore AbortError
                    console.error('Erro ao buscar as coleções', error);
                }
            } finally {
                //setIsLoading(false);
            }
        };

        fetchCollections();
    }, []);

    useEffect(() => {
        const loadCapitulos = async () => {
            if (!currentCollection) return; // Não carregar se nenhuma coleção estiver selecionada
    
            // Verifique se a coleção já foi carregada
            if (collectionsData[currentCollection]) {
                setData(collectionsData[currentCollection]);
                return;
            }
    
            setIsChapterLoading(true); // Inicia o carregamento do capítulo
            fetchCapitulosRef.current = new AbortController(); // Create a new AbortController for each fetch
    
            const url = `https://api-boas-praticas.onrender.com/api/${currentCollection}?populate=*`;
    
            try {
                const response = await fetch(url, { signal: fetchCapitulosRef.current.signal });
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data;
                    setData(data);
    
                    // Armazene os dados da coleção carregada
                    setCollectionsData(prevData => ({
                        ...prevData,
                        [currentCollection]: data
                    }));
    
                    // ... rest of your logic to set activeTitle
                } else {
                    throw new Error('Falha na requisição. Código de status: ' + response.status);
                }
            } catch (error) {
                if (error.name !== 'AbortError') { // Ignore AbortError
                    console.error(error);
                }
            } finally {
                setIsChapterLoading(false);
            }
        };
    
        loadCapitulos();
    }, [currentCollection]);

    useEffect(() => {
        // Atualiza o capítulo ativo baseado na URL
        const chapterNumber = extractChapterNumberFromAnchor(asPath);
        if (chapterNumber !== null) {
            setActiveTitle(chapterNumber);
        }
    }, [asPath]);

    useEffect(() => {
        if (activeTitle !== null) {
            scrollToTop();
            console.log('chamnou scrol top');
        }
    }, [activeTitle]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleSelectCollection = (collectionId) => {
        const collectionsMap = {
            1: 'pesticida-abelhas',
            2: 'boa-pratica-agricolas',
            3: 'boa-pratica-apicolas',
            4: 'boa-pratica-de-comunicacaos'
        };
        setCurrentCollection(collectionsMap[collectionId]);

        // Resetar o capítulo ativo ao selecionar uma nova coleção
        setActiveTitle(null);
        // Evite redirecionamento para a página inicial se não for necessário
        // router.push('/'); // Voltar para a página inicial ou para o estado inicial
    };

    const activeChapter = data.find(item => item.id === activeTitle);
    const displayedTitle = activeChapter ? activeChapter.attributes.titulo : 'Título do Capítulo';

    return (
        <>
            <Head>
                <meta name="referrer" content="no-referrer" />
                <title>Boas Práticas</title>
            </Head>

            <div className="container-wrapper">
                <Sidebar
                    isOffcanvasOpen={isOffcanvasOpen}
                    setIsOffcanvasOpen={setIsOffcanvasOpen}
                    onSelectCollection={handleSelectCollection}
                    activeCollection={activeCollection}
                    setActiveCollection={setActiveCollection}
                />

                <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
                    <div className="container-fluid">
                        <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#sidebarMenu"
                            aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle Offcanvas" onClick={handleToggleBackDrop}>
                            <i className="fas fa-bars"></i>
                        </button>
                        <Link className="navbar-brand" href="/home">
                            <Image src={Logo} width="100%" height={26} alt="logo Embrapa" />
                        </Link>
                        <ul className="navbar-nav ms-auto d-flex flex-row">
                            <li className="nav-item text-item-link">
                                <Link className="nav-link back-item-link" href="/edicao-completa" aria-current="page">
                                    <span className="link-text">Edição Completa</span>
                                </Link>
                            </li>
                            <li className="nav-item text-item-link">
                                <Link className="nav-link back-item-link" href="/autores" aria-current="page">
                                    <span className="link-text">Autores</span>
                                </Link>
                            </li>
                            <div className="hide-form-search2">
                                <form className="d-flex rounded-pill position-relative first-form-search" role="search">
                                    <div className="search-bar-container p-1">
                                        <ChapterSearch
                                            collections={sortedCollections}
                                            onSelectCollection={handleSelectCollection}
                                            closeSidebar={() => setIsOffcanvasOpen(false)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <li className="nav-item">
                                <Image src={LogoIF} className='logotipo img' width={130} height={35} alt="Logotipo do IFMS Campus Dourados" priority />
                            </li>
                            <li className="nav-item me-lg-0">
                                <Image src={LogoEmbrapa} className='logotipo img' width={70} height={48} alt="Logotipo da Embrapa" priority />
                            </li>
                            <form className="d-flex rounded-pill position-relative" role="search">
                                <div className="input-group hide-form-search">
                                    <div className="search-bar-container">
                                        <ChapterSearch
                                            collections={collections}
                                            onSelectCollection={handleSelectCollection}
                                            closeSidebar={() => setIsOffcanvasOpen(false)}
                                        />
                                    </div>
                                </div>
                            </form>
                        </ul>
                    </div>
                    {isOffcanvasOpen && <div className="offcanvas-backdrop show" onClick={handleToggleBackDrop}></div>}
                </nav>

                <main className='docMainContainer_gTbr'>
                    <div className='container padding-bottom--lg'>
                        <div className='col'>
                            <nav className="home-section" aria-label="Breadcrumbs" style={{ marginTop: 120 }}>
                                <ul className="breadcrumbs">
                                    <li className="breadcrumbs__item">
                                        <Link href="/home" className="breadcrumbs__link">
                                            <i className="fas fa-home" style={{ fontSize: '13px' }}></i>
                                        </Link>
                                        <i className="fas fa-chevron-right" style={{ fontSize: '10px' }}></i>
                                    </li>
                                    <li className="breadcrumbs__item">
                                        <span className="breadcrumbs__link">Sumário</span>
                                        <meta itemProp="position" content="1" />
                                        <i className="fas fa-chevron-right" style={{ fontSize: '10px' }}></i>
                                    </li>
                                    <BreadcrumbsItem displayedTitle={displayedTitle} />
                                </ul>
                            </nav>
                            <section className="home-section right-sidebar" style={{ marginTop: '30px' }}>
                                <div id="contents" className="bd-content ps-lg-2">
                                {isChapterLoading ? (
                                    <p>Carregando...</p>
                                ) : (
                                    <TextCapitulos lista={data} activeTitle={activeTitle} setActiveTitle={setActiveTitle} currentCollection={activeCollection} />
                                )}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
            <footer>
                <div className="container container-footer-cap bottom-0 end-0">
                    <div className="title-footer">
                        <p>Embrapa Agropecuária Oeste</p>
                    </div>
                    <div className="description-footer">
                        <p>Rodovia BR 163, Km 253,6, Caixa Postal 449, CEP: 79804-970, Dourados, MS</p>
                        <p>Fone: + 55 (67) 3416-9700</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Capitulos;