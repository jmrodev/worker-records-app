import "./Header.css"
const Header = () => {
    return (
        <header className="App-header">
            <h1 className='header-title'>My Application</h1>
            <nav className="App-nav">
                <ul className="nav-list">
                    <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
                    <li className="nav-item"><a className="nav-link" href="/about">About</a></li>
                    <li className="nav-item"><a className="nav-link" href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
}
export default Header;