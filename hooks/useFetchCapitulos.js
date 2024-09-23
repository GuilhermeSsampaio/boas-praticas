import { useState, useEffect } from "react";

// Função para extrair o número do capítulo da âncora
const extractChapterNumberFromAnchor = (path) => {
  const match = path.match(/#capitulo_(\d+)/);
  return match ? parseInt(match[1]) : null;
};

const useFetchCapitulos = (asPath) => {
  const [data, setData] = useState([]);
  const [activeTitle, setActiveTitle] = useState(null);

  // Função para carregar capítulos da API
  const CarregaCapitulos = async () => {
    const url = "https://api-cartilha.squareweb.app/api/capitulos?populate=*";

    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const data = json.data;
        setData(data);

        const chapterNumber = extractChapterNumberFromAnchor(asPath);
        if (chapterNumber !== null) {
          setActiveTitle(chapterNumber);
        } else if (data.length > 0) {
          setActiveTitle(data[0].id);
        }
      } else {
        throw new Error(
          `Falha na requisição. Código de status: ${response.status}`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    CarregaCapitulos();
  }, []);

  useEffect(() => {
    const chapterNumber = extractChapterNumberFromAnchor(asPath);
    if (chapterNumber !== null) {
      setActiveTitle(chapterNumber);
    }
  }, [asPath]);

  return { data, activeTitle, setActiveTitle };
};

export default useFetchCapitulos;
