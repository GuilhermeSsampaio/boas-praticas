import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/logo.svg';
import { useRouter } from 'next/router';

const Sidebar = ({ isOffcanvasOpen, setIsOffcanvasOpen, onSelectCollection }) => {
    const [collections, setCollections] = useState([]);
    const [activeCollection, setActiveCollection] = useState(null);
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

                setCollections([
                    { id: 1, title: 'Pesticidas e abelhas', data: responses[0].data },
                    { id: 2, title: 'Boas práticas agrícolas', data: responses[1].data },
                    { id: 3, title: 'Boas práticas apícolas', data: responses[2].data },
                    { id: 4, title: 'Boas práticas de comunicação', data: responses[3].data }
                ]);
            } catch (error) {
                console.error('Erro ao buscar as coleções', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const handleToggle = (collectionId) => {
        setActiveCollection(activeCollection === collectionId ? null : collectionId);
    };

    const handleItemClick = (collectionId) => {
        console.log('Collection clicked:', collectionId);
        onSelectCollection(collectionId); // Notifica o pai sobre a seleção
        handleToggle(collectionId);
    };

    const handleChapterClick = (chapterId) => {
        console.log('Navigating to chapter:', chapterId);
        // Atualiza a URL para o capítulo selecionado
        router.push(`#capitulo_${chapterId}`, undefined, { shallow: true });
    };

    return (
        <div className="container-wrapper">
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
                                            <i className={`fas fa-chevron-${activeCollection === collection.id ? 'down' : 'right'} icon-deg`}></i>
                                        </a>
                                        {activeCollection === collection.id && (
                                            <ul className="list-group list-group-flush mx-2 py-1">
                                                {collection.data.data.map((item) => (
                                                    <li key={item.id} className="list-group-item py-2" style={{ cursor: 'pointer' }}>
                                                        <a 
                                                            href={`#capitulo_${item.id}`}
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Previne o comportamento padrão do link
                                                                handleChapterClick(item.id); // Atualiza a URL para o capítulo selecionado
                                                            }}
                                                        >
                                                            {item.attributes.titulo}
                                                        </a>
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
