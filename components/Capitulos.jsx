import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../public/logo.svg';
import TextCapitulos from './TextCapitulos';
import { SearchBar } from "./SearchBar.jsx";
import { SearchResultsList } from "./SearchResultsList.jsx";
import Sidebar from './Sidebar.jsx';
import BreadcrumbsItem from './BreadCrumbsItem.jsx';
import { Footer } from './Footer.jsx';
import { useRef } from 'react';


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

    useEffect(() => {
        const loadCapitulos = async () => {
            if (!currentCollection) return; // Não carregar se nenhuma coleção estiver selecionada

            fetchCapitulosRef.current = new AbortController(); // Create a new AbortController for each fetch

            const url = `https://api-boas-praticas.onrender.com/api/${currentCollection}?populate=*`;

            try {
                const response = await fetch(url, { signal: fetchCapitulosRef.current.signal });
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data;
                    setData(data);

                    // ... rest of your logic to set activeTitle
                } else {
                    throw new Error('Falha na requisição. Código de status: ' + response.status);
                }
            } catch (error) {
                if (error.name !== 'AbortError') { // Ignore AbortError
                    console.error(error);
                }
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
                                        <SearchBar setResults={setResults} />
                                        {results.length > 0 && <SearchResultsList results={results} handleCloseResults={handleCloseResults}
                                            onSelectCollection={handleSelectCollection} setActiveCollection={setCurrentCollection} setActiveChapter={setActiveTitle}
                                            activeCollection={activeCollection}
                                        />}                                    
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
                                        <SearchBar setResults={setResults} />
                                        {results.length > 0 && <SearchResultsList results={results} handleCloseResults={handleCloseResults}
                                            onSelectCollection={handleSelectCollection} setActiveCollection={setCurrentCollection} setActiveChapter={setActiveTitle}
                                            activeCollection={activeCollection}
                                        />}
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
                                    <TextCapitulos lista={data} activeTitle={activeTitle} setActiveTitle={setActiveTitle} />
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
