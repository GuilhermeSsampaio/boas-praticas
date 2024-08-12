import { SearchResult } from "./SearchResult";
import Link from 'next/link';
export const SearchResultsList = ({ results, handleCloseResults }) => {
  const mappedResults = results.map(item => ({
    ...item,
    chapterId: item.id // Supondo que o id seja equivalente ao chapterId
  }));

  const handleResultClick = () => {
    handleCloseResults();
  };

  return (
    <div className="results-list" onClick={handleResultClick}>
      {mappedResults.map((result, id) => (
        <Link
          className='result-link'
          href={`http://localhost:3000/edicao-completa?collection_${result.collection}#capitulo_${result.chapterId}`}
          key={id}
          passHref
        >
          <SearchResult result={result} />
        </Link>
      ))}
    </div>
  );
};