import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import { useRouter } from 'next/router';
import { close } from '@sentry/nextjs';

const Sidebar = ({ isOffcanvasOpen, setIsOffcanvasOpen, onSelectCollection }) => {
    const [collections, setCollections] = useState([]);
    const [activeCollection, setActiveCollection] = useState(null);
    const [activeChapter, setActiveChapter] = useState(null);
    const [showSummary, setShowSummary] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCollections = async () => {
            try {
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
    }, []);

    const closeSidebar = () => {
        const sidebarMenu = document.getElementById("sidebarMenu");
        if (sidebarMenu) {
          sidebarMenu.classList.remove("show");
        }
        setIsOffcanvasOpen(false);
    }

    const handleToggle = (collectionId) => {
        setActiveCollection(activeCollection === collectionId ? null : collectionId);
        setActiveChapter(null); // Resetar capítulo ativo ao mudar a coleção ativa
    };

    const handleItemClick = (collectionId) => {
        onSelectCollection(collectionId); // Notifica o pai sobre a seleção
        handleToggle(collectionId);
    };

    const handleChapterClick = (chapterId) => {
        setActiveChapter(chapterId);
        router.push(`#capitulo_${chapterId}`, undefined, { shallow: true });
        closeSidebar();
    };

    const handleSubChapterClick = (subChapterId) => {
        router.push(`#subcapitulo_${subChapterId}`, undefined, { shallow: true });
        closeSidebar();
    };

    const toggleSubChapters = (chapterId) => {
        setActiveChapter(activeChapter === chapterId ? null : chapterId);
    };

    return (
        <div>
            <nav id="sidebarMenu" className={`collapse d-lg-block sidebar bg-white thin-scrollbar ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1">
                <div className="position-sticky">
                    <div id="summary" className="list-group list-group-flush mt-2 py-2 menu_SIkG" style={{ display: showSummary ? 'block' : 'none' }}>
                        <div className='logo-container-fixed'>
                            <div className="logo-container d-flex align-items-center justify-content-between">
                                <Link href="/home">
                                    <Image className="img-sidebar-top mx-3" src={Logo} alt="logo Embrapa" width={45} height={46} priority />
                                </Link>
                                <button id="btn-close-sidebar" type="button" className="btn-close btn-close-dark btn-close-cap" aria-label="Close" onClick={() => { setIsOffcanvasOpen(false); setShowSummary(true); }}></button>
                            </div>
                        </div>
                        <hr className="featurette-divider line-menu"></hr>
                        <button type="button" className="clean-btn navbar-sidebar__back" id="back-button" onClick={() => setShowSummary(true)}>← Voltar para o menu principal</button>
                        <div>
                            {isLoading ? (
                                <div className="list-group-item">Carregando...</div>
                            ) : (
                                collections.map((collection) => (
                                    <div key={collection.id}>
                                        <a 
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ripple ${activeCollection === collection.id ? '' : 'collapsed'}`}
                                            onClick={() => handleItemClick(collection.id)}
                                        >
                                            <span className="w-100 text-primary">{collection.title}</span>{' '}
                                            <i className={`fas fa-chevron-${activeCollection === collection.id ? 'down' : 'right'} icon-deg ${activeCollection === collection.id ? 'icon-deg-active icon-deg-down' : 'icon-deg-right'}`}></i>
                                        </a>
                                        {activeCollection === collection.id && (
                                            <ul className="list-group list-group-flush mx-2 py-1">
                                                {collection.data.data.map((item) => (
                                                    <li 
                                                        key={item.id} 
                                                        className={`list-group-item py-2 ${item.attributes.subnivel && item.attributes.subnivel.length > 0 ? 'chapter-with-subchapters' : ''}`}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <a 
                                                                href={`#capitulo_${item.id}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault(); // Previne o comportamento padrão do link
                                                                    handleChapterClick(item.id); // Navega diretamente para o capítulo
                                                                }}
                                                            >
                                                                {item.attributes.titulo}
                                                            </a>
                                                            {item.attributes.subnivel && item.attributes.subnivel.length > 0 && (
                                                                <>
                                                                    <span className="separator">|</span>
                                                                    <div 
                                                                        className={`icon-box`}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation(); // Previne que o evento de clique no link seja acionado
                                                                            toggleSubChapters(item.id); // Alterna a visibilidade dos subcapítulos
                                                                        }}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        <i 
                                                                            className={`fas fa-chevron-${activeChapter === item.id ? 'down' : 'right'} icon-deg ${activeChapter === item.id ? 'icon-deg-active icon-deg-down' : 'icon-deg-right'}`}
                                                                        ></i>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                        {activeChapter === item.id && item.attributes.subnivel && item.attributes.subnivel.length >0 &&(
                                                            // console.log(item.attributes.subnivel.length),
                                                            <ul className="list-group list-group-flush mx-2 py-1">
                                                            <p>Abra o capítulo acima para navegar em:</p>

                                                                {item.attributes.subnivel.map((subItem) => (
                                                                    <li key={subItem.id} className="list-group-item py-2" style={{ cursor: 'pointer' }}>
                                                                        <a 
                                                                            // href={`#subcapitulo_${subItem.id}`}
                                                                            onClick={(e) => {
                                                                                e.preventDefault(); // Previne o comportamento padrão do link
                                                                                handleChapterClick(item.id); // Atualiza a URL para o subcapítulo selecionado
                                                                                closeSidebar();
                                                                            }}
                                                                        >
                                                                            {subItem.titulo_secao}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
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

export default Sidebar;