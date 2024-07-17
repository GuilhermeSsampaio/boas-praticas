import { useState, useEffect, useRef } from 'react';
import TableOfContents from './TableOfContents';
let i = 0;
const TextCapitulos = ({ lista, activeTitle, setActiveTitle }) => {
  const [headerBlocks, setHeaderBlocks] = useState([]);

  useEffect(() => {
    const extractedHeaderBlocks = [];

    lista.forEach((cap) => {
      const blocks = JSON.parse(cap.attributes.description).blocks;
      blocks.forEach((block) => {
        if (block.type === 'header') {
          extractedHeaderBlocks.push(block);
        }
      });
      i++;
    });
    setHeaderBlocks(extractedHeaderBlocks);
    // console.log("headerBlocks:", extractedHeaderBlocks);
  }, [lista]);


  function convertToHTML(data) {
    let htmlContent = ''; // Variável para armazenar o conteúdo HTML

    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_"); // Criar âncora
          htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
        case 'paragraph':

          // Se não estivermos no bloco de instituição, adicione o conteúdo normal com a classe "paragrafo"
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        case 'list':
          const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
          let listItemsHTML = '';
          block.data.items.forEach((item) => {
            listItemsHTML += `<li>${item}</li>`;
          });
          htmlContent += `<${listType} class="lista">${listItemsHTML}</${listType}>`;
          break;
        // case 'image':
        //   // Use a URL do Cloudinary fornecida no bloco de dados
        //   const imageSrc = block.data.file.url;
        //   const imageCaption = block.data.caption;

        //   // Crie o elemento de imagem com a URL do Cloudinary
        //   htmlContent += `<img src="${imageSrc}" alt="${imageCaption}" />`;
        //   htmlContent += `<p class="legenda-img">${imageCaption}</p>`;
        //   break;
        case 'image':
          // Lógica para lidar com blocos de tipo 'image'
          const imageSrc = block.data.file.url;
          const imageCaption = block.data.caption;
    
          // Crie o elemento de imagem com a URL fornecida no bloco de dados
          htmlContent += `<img src="${imageSrc}" alt="${imageCaption}" />`;
          htmlContent += `<p class="legenda-img">${imageCaption}</p>`;
          break;
        case 'embed':
          const videoUrl = new URL(block.data.source);
          const videoId = videoUrl.pathname.substring(1); // Remove a barra inicial
          const videoCaption = block.data.caption;
          const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
          htmlContent +=
            ` <div id="player">
                    <div class="html5-video-player">
                      <iframe
                        width="100%"
                        height="315"
                        src=${videoEmbedUrl}
                        frameBorder="0"
                        allowFullscreen
                      >
                      </iframe>
                    </div>
                  </div>`
          break;
        // Adicione outros casos para outros tipos de blocos do Editor.js, se necessário.
        default:
          // const anchor1 = block.data.text.replace(/ /g, "_"); // Criar âncora
          // htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
      }
    });
    return htmlContent;
  }

  function RefconvertToHTML(data) {
    let htmlContent = ''; // Variável para armazenar o conteúdo HTML
    // htmlContent += `<h3>Instituição</h3>`
    htmlContent += `<div class='instituicao'>`
    data.blocks.forEach((block) => {
      switch (block.type) {
        case 'header':
          const anchor = block.data.text.replace(/ /g, "_"); // Criar âncora
          //mudei pra não bugar o titulo verde
          // htmlContent += `<h${block.data.level} class="nome-instituicao" id='${anchor}'>${block.data.text}</h$1>`;
          htmlContent += `<h4 class="nome-instituicao" id='${anchor}'>${block.data.text}</h4>`;

          break;
        case 'paragraph':
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        case 'LinkTool':
          htmlContent += `<a id='links-sites' href="${block.data.link}" target="_blank" title="Acessar site" class="paragrafo">${block.data.link}</a>`;
        break;
        default:
          // const anchor1 = block.data.text.replace(/ /g, "_"); // Criar âncora
          // htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
      }
    });
    htmlContent += `</div>`
    return htmlContent;
  }

  const currentIndex = lista.findIndex((cap) => cap.id === activeTitle);
  const prevChapter = lista[currentIndex - 1];
  const nextChapter = lista[currentIndex + 1];

  const handleNavigation = (chapterId) => {
    setActiveTitle(chapterId);
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Adicionando um efeito de rolagem suave
    });
  };

  return (
    <>
      <div className="text-with-toc">
        <div className="text-content">
          <article className='article'>
            {lista.map((cap) => (
              <div key={cap.id} className="bd-content ps-lg-2">
                {activeTitle === cap.id && (
                  <h1>{cap.attributes.title}</h1>
                )}
                {activeTitle === cap.id && (
                  <div className='center-textArticle'>{cap.attributes.subtitle}</div>
                )}
                {activeTitle === cap.id && (
                  <div dangerouslySetInnerHTML={{ __html: convertToHTML(JSON.parse(cap.attributes.description)) }} />
                )}

                {/* {activeTitle === cap.id && cap.attributes.referencias && cap.attributes.referencias.length > 0 && cap.attributes.referencias.description != null && ( */}
                {activeTitle === cap.id && cap.attributes.referencias && cap.attributes.referencias.length > 0 && cap.attributes.referencias[0].description != null && (

                  <div className="references-section">
                    <h3>Instituição</h3>
                    {cap.attributes.referencias.map((ref, index) => (
                      <div key={index} className="reference">
                        {ref.description && (
                          <div
                            className="reference-content"
                            dangerouslySetInnerHTML={{ __html: RefconvertToHTML(JSON.parse(ref.description)) }}

                            // dangerouslySetInnerHTML={{
                            //   __html: JSON.parse(ref.description).blocks[0].data.text
                            // }}
                            // {convertToHTML(JSON.parse(ref.description))}
                          />
                        )}
                        {console.log("instituicao",cap.attributes.referencias)} 
                       {/* Estilize cada referência conforme necessário */}
                      </div>
                    ))}
                  </div>
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
            <div className="pagination-nav__label">{prevChapter.attributes.title}</div>
          </button>
        )}
        {nextChapter && (
          <button
            className="pagination-nav__link pagination-nav__link--next"
            onClick={() => handleNavigation(nextChapter.id)}
          >
            <div className="pagination-nav__sublabel">Próxima</div>
            <div className="pagination-nav__label">{nextChapter.attributes.title}</div>
          </button>
        )}
      </nav>
    </>
  );
};

export default TextCapitulos;