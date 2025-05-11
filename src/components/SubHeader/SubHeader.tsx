import React, { JSX } from 'react';
import { Link } from 'react-router-dom';

export default function NavBar(): JSX.Element {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
}