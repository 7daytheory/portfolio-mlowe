import './Header.css';

function Header() {
  return (
    <nav class='navigation'>
      <ul>
        <li><a href='projects'>Projects</a></li>
        <li><a href='resume'>Resume</a></li>
        <li><a href='about'>About</a></li>
        <li><a href='contact'>Contact</a></li>
      </ul>
    </nav>
  );
}

export default Header;
