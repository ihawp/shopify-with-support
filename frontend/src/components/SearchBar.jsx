import { useState } from 'react';

import { useNavigation } from '../middleware/NavigationProvider';

export const cleanString = (string) => {
    return String(string).trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

export default function SearchBar() {

    const [query, setQuery] = useState("");

    const navigate = useNavigation();

    const makeSearch = (event) => {
    
        event.preventDefault();

        let searchQuery = cleanString(query);

        navigate(`/search/${searchQuery}`);
  
        setQuery("");

    };
    
    return <nav aria-label="Search Bar">
        <form id="search-form" onSubmit={ makeSearch }>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="text" name="search-bar" title="Search Bar" placeholder="Search" required/>
            <input type="submit" value="Search" />
        </form>
    </nav>;
}