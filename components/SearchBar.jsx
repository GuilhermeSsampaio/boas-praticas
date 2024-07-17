import { useState, useEffect } from "react";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  const fetchData = (value) => {
    fetch("https://tecnofam-strapi.cpao.embrapa.br/api/capitulos")
      .then((response) => response.json())
      .then((data) => {
        const results = data.data.filter((capitulo) => {
          return (
            value &&
            capitulo.attributes &&
            capitulo.attributes.title &&
            capitulo.attributes.title.toLowerCase().includes(value.toLowerCase())
          );
        });
        setResults(results);
        setShowNoResultsMessage(results.length === 0 && value.trim() !== ""); 
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setResults([]);
        setShowNoResultsMessage(true);
      });
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
  }, [input]);

  return (
    <div className="input-wrapper">
      <i id="search-icon" className="fas fa-search"></i>
      <input
        className="navbar-input"
        placeholder="Buscar"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      {showNoResultsMessage && <div className="results-list"><p className='result-nulo'>Nenhum resultado encontrado para "{input}".</p></div>}
    </div>
  );
};