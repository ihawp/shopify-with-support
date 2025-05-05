import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { cleanString } from "../components/SearchBar";

export default function Search() {
    
    const { query } = useParams();

    const cleanedQuery = cleanString(query);
    
    useEffect(() => {
        // make query

        console.log(query);

    }, []);

    return <main>
        <header>
            <h1>You searched for {cleanedQuery}:</h1>
        </header>
        <section>
            <p>Print results here.</p>
        </section>
    </main>;
}