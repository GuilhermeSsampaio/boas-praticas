import { useState, useEffect } from 'react';
import TableOfContents from './TableOfContents';
import ContentConverter from './ContentConverter';
import RefContentConverter from './RefContentConverter';
import { useRouter } from 'next/router';

const TextCapitulos = ({ lista, activeTitle, setActiveTitle }) => {
  const [headerBlocks, setHeaderBlocks] = useState([]);
  const [activeSubChapter, setActiveSubChapter] = useState(null);
  const [subchaptersList, setSubchaptersList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const extractedHeaderBlocks = lista.flatMap((cap) => {
      const blocks = JSON.parse(cap.attributes.descricao).blocks;
      return blocks.filter((block) => block.type === 'header');
    });
    setHeaderBlocks(extractedHeaderBlocks);
  }, [lista]);

  useEffect(() => {
    // Update the list of subchapters based on the active chapter
    const activeChapter = lista.find(cap => cap.id === activeTitle);
    if (activeChapter) {
      setSubchaptersList(activeChapter.attributes.subnivel || []);
    }
  }, [activeTitle, lista]);

  useEffect(() => {
    const chapterMatch = router.asPath.match(/#capitulo_(\d+)/);
    const subChapterMatch = router.asPath.match(/#subcapitulo_(\d+)/);
    
    if (chapterMatch) {
      const chapterId = parseInt(chapterMatch[1]);
      if (chapterId !== activeTitle) {
        setActiveTitle(chapterId);
        setActiveSubChapter(null);
      }
    } else if (subChapterMatch) {
      const subChapterId = parseInt(subChapterMatch[1]);
      const parentChapter = lista.find(cap => cap.attributes.subnivel.some(sub => sub.id === subChapterId));
      if (parentChapter) {
        setActiveTitle(parentChapter.id);
        setActiveSubChapter(subChapterId);
      }
    }
  }, [router.asPath, activeTitle, lista, setActiveTitle]);

  const handleNavigation = (chapterId) => {
    setActiveTitle(chapterId);
    setActiveSubChapter(null);
    router.push(`#capitulo_${chapterId}`, undefined, { shallow: true });
  };

  const handleSubChapterNavigation = (subChapterId) => {
    setActiveSubChapter(subChapterId);
    router.push(`#subcapitulo_${subChapterId}`, undefined, { shallow: true });

    // Garantir que o subcapítulo seja rolado para a visibilidade
    setTimeout(() => {
        const subChapterElement = document.getElementById(subChapterId);
        if (subChapterElement) {
            subChapterElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100); // Ajuste o tempo conforme necessário
};

  const currentIndex = lista.findIndex((cap) => cap.id === activeTitle);
  const prevChapter = lista[currentIndex - 1];
  const nextChapter = lista[currentIndex + 1];

  return (
    <>
      <div className="text-with-toc">
        <div className="text-content">
          <article className='article'>
            {lista.map((cap) => (
              <div key={cap.id} className="bd-content ps-lg-2">
                {activeTitle === cap.id && (
                  <>
                    <h1>{cap.attributes.titulo}</h1>
                    <div className='center-textArticle'>{cap.attributes.subtitle}</div>
                    <ContentConverter data={JSON.parse(cap.attributes.descricao)} />
                    {cap.attributes.subnivel && cap.attributes.subnivel.length > 0 && (
                      <div className="subchapter-section">
                        {cap.attributes.subnivel.map((subcap) => (
                          <div key={subcap.id} className="subchapter">
                            <h4
                              onClick={() => handleSubChapterNavigation(subcap.id)}
                              style={{ cursor: 'pointer', color: activeSubChapter === subcap.id ? 'blue' : 'black' }}
                            >
                              {subcap.titulo_secao}
                            </h4>
                              <ContentConverter data={JSON.parse(subcap.texto_conteudo)} />
                            
                          </div>
                        ))}
                      </div>
                    )}
                    {cap.attributes.referencias && cap.attributes.referencias.length > 0 && cap.attributes.referencias[0].descricao != null && (
                      <div className="references-section">
                        <h3>Instituição</h3>
                        {cap.attributes.referencias.map((ref, index) => (
                          <div key={index} className="reference">
                            {ref.descricao && (
                              <RefContentConverter data={JSON.parse(ref.descricao)} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </article>
        </div>
        <div className="table-of-contents">
          {subchaptersList.length > 0 && (
          <TableOfContents
          headerBlocks={subchaptersList}
          
            subchapters={subchaptersList}
            onClick={(id) => handleSubChapterNavigation(id)}
          />
          )}
        </div>
      </div>
      <nav className="pagination-nav docusaurus-mt-lg" aria-label="Páginas de documentação" style={{ zIndex: 99999 }}>
        {prevChapter && (
          <button
            className="pagination-nav__link pagination-nav__link--prev"
            onClick={() => handleNavigation(prevChapter.id)}
          >
            <div className="pagination-nav__sublabel">Anterior</div>
            <div className="pagination-nav__label">{prevChapter.attributes.titulo}</div>
          </button>
        )}
        {nextChapter && (
          <button
            className="pagination-nav__link pagination-nav__link--next"
            onClick={() => handleNavigation(nextChapter.id)}
          >
            <div className="pagination-nav__sublabel">Próxima</div>
            <div className="pagination-nav__label">{nextChapter.attributes.titulo}</div>
          </button>
        )}
      </nav>
    </>
  );
};

export default TextCapitulos;
