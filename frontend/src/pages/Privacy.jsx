import '../styles/Privacy/privacy.css';

export default function Privacy() {
    return <main className='flex flex-col items-center' id='privacy'>
            <header>
                <h1>Privacy Policy</h1>
            </header>
            <section>
                <h2>Introduction</h2>
                <p>
                    Welcome to (store.ihawp.com). We value your privacy and are committed to protecting your personal information. 
                    This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.
                </p>

                <h2>Information We Collect</h2>
                <p>
                    We collect various types of information during checkout, including:
                </p>
                <ul>
                    <li>Personal Information: Name, email address.</li>
                    <li>Payment Information: Credit card details, billing address, etc. (All payment information is processed securely by Shopify.)</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>
                    We use your information for the following purposes:
                </p>
                <ul>
                    <li>Processing and fulfilling your orders.</li>
                    <li>Communicating with you regarding your orders or account.</li>
                    <li>Personalizing your shopping experience.</li>
                    <li>Improving our website and services.</li>
                    <li>Compliance with legal obligations.</li>
                </ul>

                <h2>How We Protect Your Information</h2>
                <p>
                    We implement a variety of security measures to ensure the safety of your personal information. Your payment details are encrypted and processed securely by third-party payment processors.
                </p>

                <h2>Sharing Your Information</h2>
                <p>
                    We do not sell, trade, or rent your personal information to others. However, we may share information with trusted third parties to help operate our website or process payments. All third-party service providers are required to keep your information confidential.
                </p>

                <h2>Cookies</h2>
                <p>
                    Our website uses cookies to enhance your shopping experience. Cookies are small files stored on your device to help us remember your preferences and optimize site functionality. You can choose to disable cookies in your browser settings.
                </p>

                <h2>Your Rights</h2>
                <p>
                    Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. If you wish to exercise any of these rights, please contact us.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                    We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with the updated date.
                </p>

                <h2>Contact Us</h2>
                <p>
                    If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:ihawp@ihawp.com" title="Email ihawp@ihawp.com">ihawp@ihawp.com</a>.
                </p>
            </section>
        </main>;
}
