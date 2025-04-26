
import React from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isInstructor = user?.role === "Instructor";
    const isSecretary = user?.role === "Department Secretary";
    const isChair = user?.role === "Chair";

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
            <Container fluid>
                <BootstrapNavbar.Brand className="fw-bold">
                    <i className="bi bi-building me-2"></i>
                    Department Management System
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {(isSecretary || isChair) && (
                            <Nav.Link as={Link} to="/user-management" className="mx-2">
                                <i className="bi bi-people-fill me-1"></i>
                                User Management
                            </Nav.Link>
                        )}

                        <NavDropdown title="Lecture Management" id="lecture-dropdown">
                            {!isInstructor && (
                                <>
                                    <NavDropdown.Item as={Link} to="/lecture-list">
                                        <i className="bi bi-list-check me-1"></i>
                                        Lecture List
                                    </NavDropdown.Item>
                                    
                                    <NavDropdown.Item as={Link} to="/classroom-management">
                                        <i className="bi bi-building me-1"></i>
                                        Classroom Management
                                    </NavDropdown.Item>


                                    <NavDropdown.Item as={Link} to="/management-schedule">
                                        <i className="bi bi-calendar2-week me-1"></i>
                                        Program Management
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>

                        

                        <NavDropdown title="Exam Operations" id="exam-dropdown">
                            <NavDropdown.Item>
                                <i className="bi bi-calendar-event me-1"></i>
                                Exam Schedule
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <i className="bi bi-plus-circle me-1"></i>
                                Add Exam
                            </NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown
                            title={<><i className="bi bi-person-circle me-1"></i> {user?.email}</>}
                            align="end"
                            id="user-dropdown"
                        >
                            <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                <i className="bi bi-box-arrow-right me-1"></i>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;