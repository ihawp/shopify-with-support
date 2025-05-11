export default function Member({ imgSrc, name, job }) {
    return <li className="support-agent">
        <img src={`/${imgSrc}`} loading="lazy" alt={`${name}: ${job}`} draggable="false" />
        <span className="name">{name}</span>
        <span className="job">{job}</span>
    </li>
}