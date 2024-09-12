const ContentConverter = ({ data }) => {
  const convertToHTML = (data) => {
    let htmlContent = "";
    data.blocks.forEach((block) => {
      switch (block.type) {
        case "header":
          const anchor = block.data.text.replace(/ /g, "_");
          htmlContent += `<h${block.data.level} class="titulo" id='${anchor}'>${block.data.text}</h${block.data.level}>`;
          break;
        case "paragraph":
          htmlContent += `<p class="paragrafo">${block.data.text}</p>`;
          break;
        case "list":
          const listType = block.data.style === "ordered" ? "ol" : "ul";
          const listItemsHTML = block.data.items
            .map((item) => `<li>${item}</li>`)
            .join("");
          htmlContent += `<${listType} class="lista">${listItemsHTML}</${listType}>`;
          break;
        case "image":
          const imageSrc = block.data.file.url;
          const imageCaption = block.data.caption;
          htmlContent += `<img src="${imageSrc}" alt="${imageCaption}" />`;
          htmlContent += `<p class="legenda-img">${imageCaption}</p>`;
          break;
        case "embed":
          const videoUrl = new URL(block.data.source);
          const videoId = videoUrl.pathname.substring(1);
          const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
          htmlContent += `<div id="player">
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

  return (
    <>
      {/* {console.log(data)}{" "} */}
      <div dangerouslySetInnerHTML={{ __html: convertToHTML(data) }} />
    </>
  );
};

export default ContentConverter;
