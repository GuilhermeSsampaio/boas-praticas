import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/logo.svg'

const Sidebar = ({ isOffcanvasOpen, setIsOffcanvasOpen }) => {
    const [collections, setCollections] = useState([]);
    const [activeCollection, setActiveCollection] = useState(null);
    const [showSummary, setShowSummary] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        // Função para buscar os dados das coleções
        const fetchCollections = async () => {
            try {
                const response1 = await axios.get('https://api-cartilha-teste2.onrender.com/api/pesticida-abelhas?populate=*');
                const response2 = await axios.get('https://api-cartilha-teste2.onrender.com/api/boa-pratica-agroes?populate=*');
                const response3 = await axios.get('https://api-cartilha-teste2.onrender.com/api/boa-pratica-apicolas?populate=*');
                const response4 = await axios.get('https://api-cartilha-teste2.onrender.com/api/boa-pratica-comunicacaos?populate=*');

                setCollections([
                    { id: 1, title: 'Pesticidas e abelhas', data: response1.data },
                    { id: 2, title: 'Boas práticas agrícolas', data: response2.data },
                    { id: 3, title: 'Boas práticas apícolas', data: response3.data },
                    { id: 4, title: 'Boas práticas de comunicação', data: response4.data }
                ]);
            } catch (error) {
                console.error('Erro ao buscar as coleções', error);
            }
        };

        fetchCollections();
    }, []);

    const handleToggle = (collectionId) => {
        setActiveCollection(activeCollection === collectionId ? null : collectionId);
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="container-wrapper">
            <nav id="sidebarMenu" className={`collapse d-lg-block sidebar bg-white thin-scrollbar ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1">
                <div className="position-sticky">
                    <div id="summary" className="list-group list-group-flush mt-2 py-2 menu_SIkG" style={{ display: showSummary ? 'block' : 'none' }}>
                        <div className='logo-container-fixed'>
                            <div className="logo-container d-flex align-items-center justify-content-between">
                                <Link href="/home">
                                    <Image className="img-sidebar-top mx-3" src="/logo.png" alt="logo Embrapa" width={45} height={46} priority />
                                </Link>
                                <button id="btn-close-sidebar" type="button" className="btn-close btn-close-dark btn-close-cap" data-bs-dismiss="collapse" aria-label="Close" onClick={() => { setIsOffcanvasOpen(false); setShowSummary(true); }}></button>
                            </div>
                        </div>
                        <hr className="featurette-divider line-menu"></hr>
                        <button type="button" className="clean-btn navbar-sidebar__back" id="back-button" onClick={() => setShowSummary(true)}>← Voltar para o menu principal</button>
                        <div>
                            {collections.map((collection) => (
                                <div key={collection.id}>
                                    <a 
                                        className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ripple ${activeCollection === collection.id ? 'collapsed' : ''}`}
                                        onClick={() => handleToggle(collection.id)}
                                    >
                                        <span className="w-100 text-primary">{collection.title}</span>{' '}
                                        <i className={`fas fa-chevron-${activeCollection === collection.id ? 'down' : 'right'} icon-deg`}></i>
                                    </a>
                                    {activeCollection === collection.id && (
                                        <ul className="list-group list-group-flush mx-2 py-1">
                                            {console.log(collections)}
                                            {collection.data.data.map((item) => (
                                                <li key={item.id} className="list-group-item py-2" style={{cursor: 'pointer'}}>
                                                    <a href={`#item_${item.id}`}>{item.attributes.titulo}</a>
                                                </li>
                                                
                                            ))}
                                            
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
