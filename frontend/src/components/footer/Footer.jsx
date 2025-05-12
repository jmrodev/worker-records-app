import "./Footer.css"

const Footer = () => {
    return (
        <footer className="App-footer">
            <div className="footer-content">
                <p>&copy; 2023 Your Company Name. All rights reserved.</p>
                <ul className="footer-socials">
                    <li className="footer-links"><a href="#">Facebook</a></li>
                    <li className="footer-links"><a href="#">Twitter</a></li>
                    <li className="footer-links"><a href="#">LinkedIn</a></li>
                </ul>
            </div>
        </footer>
    )
}
export default Footer