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
  .nav-link .social-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    color: white;
    font-size: 12px;
    font-weight: 700;
  }
`;

// --- Refactored RSnavbar Component ---

const RSnavbar = () => {
  // 1. The 'useState' hook replaces the class component's state.
  const [isOpen, setIsOpen] = useState(false);

  // 2. The toggle function is now a simple const that calls the state updater.
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <style>{GlobalStyles}</style>
      <Navbar color="secondary" dark expand="md" className="bg-slate-800">
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
                <span className="social-badge" aria-hidden="true">GH</span>
                <span className="visually-hidden">GitHub Profile</span>
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
                <span className="social-badge" aria-hidden="true">IN</span>
                <span className="visually-hidden">LinkedIn Profile</span>
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
