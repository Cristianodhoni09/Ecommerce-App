import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

const SearchProvider = ({ children }) => { //Children represents the components that will be wrapped inside the SearchProvider
  const [search, setSearch] = useState({ //Stores the current search keyword and the search results
    keyword: "",
    results: [],
   });

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

//Custom hook
const useSearch = () => useContext(SearchContext);

export { SearchProvider, useSearch };
