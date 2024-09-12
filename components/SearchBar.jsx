import { useState, useEffect } from "react";

const API_URLS = [
  {
    id: 1,
    url: "https://api-cartilha.squareweb.app/api/pesticida-abelhas?populate=*",
  },
  {
    id: 2,
    url: "https://api-cartilha.squareweb.app/api/boa-pratica-agricolas",
  },
  {
    id: 3,
    url: "https://api-cartilha.squareweb.app/api/boa-pratica-apicolas?populate=*",
  },
  {
    id: 4,
    url: "https://api-cartilha.squareweb.app/api/boa-pratica-de-comunicacaos",
  },
];

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  const fetchData = async (value) => {
    const allResults = [];

    try {
      for (const { id, url } of API_URLS) {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const filteredResults = data.data.filter((capitulo) => {
            return (
              capitulo.attributes &&
              capitulo.attributes.titulo &&
              capitulo.attributes.titulo
                .toLowerCase()
                .includes(value.toLowerCase())
            );
          });

          // Adicionar a coleção a cada item de resultado
          const resultsWithCollection = filteredResults.map((item) => ({
            ...item,
            collection: id,
          }));

          allResults.push(...resultsWithCollection);
        } else {
          console.error(
            "Falha na requisição. Código de status:",
            response.status
          );
        }
      }

      const uniqueResults = Array.from(
        new Map(
          allResults.map((item) => [item.attributes.titulo, item])
        ).values()
      );

      setResults(uniqueResults);
      setShowNoResultsMessage(
        uniqueResults.length === 0 && value.trim() !== ""
      );
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setResults([]);
      setShowNoResultsMessage(true);
    }
  };

  const handleChange = (value) => {
    setInput(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      fetchData(value.toLowerCase());
    }, 200);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    setResults([]);
    setShowNoResultsMessage(false);
  }, [input, setResults]);

  return (
    <div className="input-wrapper">
      <i id="search-icon" className="fas fa-search"></i>
      <input
        className="navbar-input"
        placeholder="Buscar"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      {showNoResultsMessage && (
        <div className="results-list">
          <p className="result-nulo">
            Nenhum resultado encontrado para "{input}".
          </p>
        </div>
      )}
    </div>
  );
};
