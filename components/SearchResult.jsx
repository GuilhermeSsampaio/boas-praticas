export const SearchResult = ({ result }) => {
  return (
    <div
      className="search-result"
    >
      {result.attributes.titulo}
    </div>
  );
};