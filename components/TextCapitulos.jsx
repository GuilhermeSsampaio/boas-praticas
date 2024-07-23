import { useState, useEffect } from 'react';
import TableOfContents from './TableOfContents';
import { useRouter } from 'next/router';

const TextCapitulos = ({ lista, activeTitle, setActiveTitle }) => {
  const [headerBlocks, setHeaderBlocks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Extrair blocos de cabeçalho
    const extractedHeaderBlocks = lista.flatMap((cap) => {
      const blocks = JSON.parse(cap.attributes.descricao).blocks;
      return blocks.filter((block) => block.type === 'header');
    });
    setHeaderBlocks(extractedHeaderBlocks);
  }, [lista]);

  useEffect(() => {
    // Sincronizar activeTitle com a URL
    const chapterMatch = router.asPath.match(/#item_(\d+)/);
    if (chapterMatch) {
      const chapterId = parseInt(chapterMatch[1]);
      if (chapterId !== activeTitle) {
        setActiveTitle(chapterId);
      }
    }
  }, [router.asPath, activeTitle, setActiveTitle]);

  const convertToHTML = (data) => {
    let htmlContent = '';
    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_");
          htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
        case 'paragraph':
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        case 'list':
          const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
          const listItemsHTML = block.data.items.map(item => `<li>${item}</li>`).join('');
          htmlContent += `<${listType} class="lista">${listItemsHTML}</${listType}>`;
          break;
        case 'image':
          const imageSrc = block.data.file.url;
          const imageCaption = block.data.caption;
          htmlContent += `<img src="${imageSrc}" alt="${imageCaption}" />`;
          htmlContent += `<p class="legenda-img">${imageCaption}</p>`;
          break;
        case 'embed':
          const videoUrl = new URL(block.data.source);
          const videoId = videoUrl.pathname.substring(1);
          const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
          htmlContent +=
            `<div id="player">
              <div class="html5-video-player">
                <iframe width="100%" height="315" src="${videoEmbedUrl}" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>`;
          break;
        default:
          break;
      }
    });
    return htmlContent;
  };

  const RefconvertToHTML = (data) => {
    let htmlContent = `<div class='instituicao'>`;
    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_");
          htmlContent += `<h4 class="nome-instituicao" id='${anchor}'>${block.data.text}</h4>`;
          break;
        case 'paragraph':
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        case 'LinkTool':
          htmlContent += `<a id='links-sites' href="${block.data.link}" target="_blank" title="Acessar site" class="paragrafo">${block.data.link}</a>`;
          break;
        default:
          break;
      }
    });
    htmlContent += `</div>`;
    return htmlContent;
  };

  const currentIndex = lista.findIndex((cap) => cap.id === activeTitle);
  const prevChapter = lista[currentIndex - 1];
  const nextChapter = lista[currentIndex + 1];

  const handleNavigation = (chapterId) => {
    setActiveTitle(chapterId);
    router.push(`#item_${chapterId}`);
  };

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
                    <div dangerouslySetInnerHTML={{ __html: convertToHTML(JSON.parse(cap.attributes.descricao)) }} />
                    {cap.attributes.referencias && cap.attributes.referencias.length > 0 && cap.attributes.referencias[0].descricao != null && (
                      <div className="references-section">
                        <h3>Instituição</h3>
                        {cap.attributes.referencias.map((ref, index) => (
                          <div key={index} className="reference">
                            {ref.descricao && (
                              <div
                                className="reference-content"
                                dangerouslySetInnerHTML={{ __html: RefconvertToHTML(JSON.parse(ref.descricao)) }}
                              />
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
          <TableOfContents key={activeTitle} headerBlocks={headerBlocks} />
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
