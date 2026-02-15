import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

// --- Helper Components & Styles ---
// Since the original code imports external assets, these are simple placeholders.

const GlobalStyles = `
  /* Mock styles from navbar.css */
  .navbar-brand {
    font-weight: bold;
  }
  .nav-link img {
    height: 24px; /* Set a consistent height for navbar icons */
    width: auto;
    filter: invert(100%); /* Example style to make icons visible on a dark navbar */
  }
`;

// Placeholder for local image imports
const gitImg = 'https://placehold.co/24x24/ffffff/000000?text=G';
const linkedinImg = 'https://placehold.co/24x24/ffffff/000000?text=in';


// --- Refactored RSnavbar Component ---

const RSnavbar = () => {
  // 1. The 'useState' hook replaces the class component's state.
  const [isOpen, setIsOpen] = useState(false);

  // 2. The toggle function is now a simple const that calls the state updater.
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <style>{GlobalStyles}</style>
      <Navbar color="secondary" dark expand="md">
        <NavbarBrand href="/">PhaseMatrixMedia</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        {/* 3. The 'isOpen' state variable is used directly here. */}
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            {/* The NavLink is now correctly wrapped in a NavItem */}
            <NavItem>
              <NavLink href="https://github.com/PMatrixMedia" target="_blank" rel="noopener noreferrer">
                <img src={gitImg} alt="GitHub Profile" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://codesandbox.io/u/PMatrixMedia" target="_blank" rel="noopener noreferrer">
                Code Sand Box
              </NavLink>
            </NavItem>
            {/* The NavLink is now correctly wrapped in a NavItem */}
            <NavItem>
              <NavLink href="https://www.linkedin.com/in/christopher-faison-1b7b6948" target="_blank" rel="noopener noreferrer">
                <img src={linkedinImg} alt="LinkedIn Profile" />
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Projects
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="https://phasevr.pmatrix.now.sh/">
                  Phasevr
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#"> {/* It's good practice to provide an href */}
                  Cuber
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#"> {/* It's good practice to provide an href */}
                  JamSesh
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default RSnavbar;