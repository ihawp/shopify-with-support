import { Link } from 'react-router-dom';

import '../styles/Hero/hero.css';

import { HashLink } from 'react-router-hash-link';

export default function Hero({ leftIdentity, backgroundClass, title, subtitle, description, hashLinks, links }) {
    return <header id="hero">
        <div className='hero-wrapper'>
            <div className={`${leftIdentity} left`}>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
                <p>{description}</p>
                <div className='buttons flex flex-row items-center gap-0-5'>
                    {hashLinks ? hashLinks.map((item, key) => {
                        return <HashLink key={key} smooth to={item.to}>
                            <button className='py-1 px-0-5'>{item.title}</button>
                        </HashLink>
                    }) : null}
                    {links ? links.map((item, key) => {
                        return <Link key={key} to={item.to}>
                            <button className='py-1 px-0-5'>{item.title}</button>
                        </Link>
                    }) : null}
                </div>
            </div>
            <div className={`${backgroundClass} right`}>
            </div>
        </div>
    </header>
}