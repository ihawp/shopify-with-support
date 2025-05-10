import { useParams } from 'react-router-dom';

export default function Product() {
    const { id } = useParams();

    console.log(id);

    return <main>
        <header>
            <h1>Product page</h1>
        </header>
        <section>
        </section>
    </main>;
}