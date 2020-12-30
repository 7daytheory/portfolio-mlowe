import './Header.css';

function Header() {
  return (
  <header>
    <nav class='navigation'>
      <ul>
        <li><a href='projects'>Projects</a></li>
        <li><a href='resume'>Resume</a></li>
        <li><a href='about'>About</a></li>
        <li><a href='contact'>Contact</a></li>
      </ul>
    </nav>

    <h1 id='name'>Matthew Lowe</h1>
    <h2 id='title'>Front & Back End Developer</h2>
  </header>
    )
}

export default Header;
