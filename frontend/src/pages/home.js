import Chat from "../components/Chat.js";

export default function Home() {
  const container = document.createElement('section');

  container.innerHTML = `
    <header>
      <h1>Home</h1>
    </header>
    <section>
      <p>Section Content</p>
    </section>
  `;

  const chatSection = document.createElement('section');
  chatSection.appendChild(Chat());
  container.appendChild(chatSection);

  return container;
}
