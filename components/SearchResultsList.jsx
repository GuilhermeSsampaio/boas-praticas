import { SearchResult } from "./SearchResult";
import Link from 'next/link';
export const SearchResultsList = ({ results, handleCloseResults, onSelectCollection, setActiveCollection, setActiveChapter }) => {
  const mappedResults = results.map(item => ({
    ...item,
    chapterId: item.id // Supondo que o id seja equivalente ao chapterId
  }));

  const handleResultClick = (result) => {
    console.log('result',result)

    onSelectCollection(result.collection);
    setActiveCollection(result.collection);
    setActiveChapter(result.chapterId);
    handleCloseResults();

  };
console.log(mappedResults)
  return (
    <div className="results-list" onClick={handleResultClick}>
      {mappedResults.map((result, id) => (
        <Link
          className='result-link'
          href={`/edicao-completa#collection_${result.collection}#capitulo_${result.chapterId}`}
          key={id}
          passHref
          onClick={() => handleResultClick(result)}

        >
          <SearchResult result={result} />
        </Link>
      ))}
    </div>
  );
};