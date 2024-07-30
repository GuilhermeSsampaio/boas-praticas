export const Navbar = () => {
    var LogoIF = require('../public/ifms-dr-marca-2015.png');
    var LogoEmbrapa = require('../public/logo-embrapa-400.png');
    const router = useRouter();
    const { asPath } = router;
    const [results, setResults] = useState([]);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const [data, setData] = useState([]);
    const [activeTitle, setActiveTitle] = useState(null);
    const [currentCollection, setCurrentCollection] = useState(null);

    // Atualiza o capítulo ativo e a URL
    const handleTitleClick = (titleId) => {
        setActiveTitle(titleId);
        localStorage.setItem('activeChapter', titleId.toString());
        router.push(`#capitulo_${titleId}`, undefined, { shallow: true });
    };

    const handleToggleBackDrop = () => {
        setIsOffcanvasOpen((prevState) => !prevState);
    };

    const handleCloseResults = () => {
        setResults([]);
    };

    const extractChapterNumberFromAnchor = (path) => {
        const match = path.match(/#capitulo_(\d+)/);
        return match ? parseInt(match[1]) : null;
    };

    useEffect(() => {
        const loadCapitulos = async () => {
            if (!currentCollection) return; // Não carregar se nenhuma coleção estiver selecionada

            const url = `https://api-cartilha-teste2.onrender.com/api/${currentCollection}?populate=*`;

            try {
                const response = await fetch(url);
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data;
                    setData(data);

                    const chapterNumber = extractChapterNumberFromAnchor(asPath);
                    if (chapterNumber !== null) {
                        setActiveTitle(chapterNumber);
                    } else {
                        const storedChapter = localStorage.getItem('activeChapter');
                        if (storedChapter) {
                            setActiveTitle(parseInt(storedChapter));
                        } else if (data.length > 0) {
                            setActiveTitle(data[0].id);
                        }
                    }
                } else {
                    throw new Error('Falha na requisição. Código de status: ' + response.status);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadCapitulos();
    }, [asPath, currentCollection]);

    useEffect(() => {
        // Atualiza o capítulo ativo baseado na URL
        const chapterNumber = extractChapterNumberFromAnchor(asPath);
        if (chapterNumber !== null) {
            setActiveTitle(chapterNumber);
        }
    }, [asPath]);

    useEffect(() => {
        if (activeTitle !== null) {
            // scrollToTop();
            console.log('chamnou scrol top')
        }
    }, [activeTitle]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

 

    const activeChapter = data.find(item => item.id === activeTitle);

    return(
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
                                        {results.length > 0 && <SearchResultsList results={results} handleCloseResults={handleCloseResults} />}
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
                                        {results.length > 0 && <SearchResultsList results={results} handleCloseResults={handleCloseResults} />}
                                    </div>
                                </div>
                            </form>
                        </ul>
                    </div>
                    {isOffcanvasOpen && <div className="offcanvas-backdrop show" onClick={handleToggleBackDrop}></div>}
                </nav>
    )
}