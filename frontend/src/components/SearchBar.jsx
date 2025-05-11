import { useState, useEffect, useRef } from 'react';

export const cleanString = (string) => {
    return String(string).trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
}

export default function SearchBar({ fetchFromSearch, setSearchResults }) {

    const [query, setQuery] = useState("");
    const input = useRef();

    const makeSearch = (event) => {
        event.preventDefault();
        setQuery(input.current.value);
        input.current.value = '';
        setQuery("");
    };

    const doSearch = (query) => {
        fetchFromSearch(query);
    }

    useEffect(() => {
        if (query !== '') doSearch(query);

        setSearchResults(null);

    }, [query])
    
    return <nav aria-label="Search Bar Navigation" className='search-navigation flex flex-row'>
        <form id="search-form" className='single' onSubmit={ makeSearch }>
            <input value={query} ref={input} onChange={(event) => setQuery(event.target.value)} type="text" name="search-bar" title="Search Bar" placeholder="Search" required/>
            <button type="submit" className="flex flex-row items-center w-unset">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                <span className="send-text">Search</span>
            </button>
        </form>
    </nav>;
}