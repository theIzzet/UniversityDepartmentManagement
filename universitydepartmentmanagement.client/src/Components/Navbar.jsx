
import React from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaUsersCog, FaListAlt, FaSchool, FaCalendarAlt as FaCalendarWeek, FaUserCircle, FaSignOutAlt, FaUniversity, FaChair, FaRegCalendarAlt } from 'react-icons/fa';
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isInstructor = user?.role === "Instructor";
    const isSecretary = user?.role === "Department Secretary";
    const isChair = user?.role === "Chair";

    return (
        <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
            <Container fluid>
                <BootstrapNavbar.Brand className="fw-bold">
                    <FaUniversity className="bi bi-building me-2"></FaUniversity>
                    Department Management System
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">

                    <Nav className="ms-auto">
                        {(isSecretary || isChair) && (
                            <Nav.Link as={Link} to="/user-management" className="mx-2">
                                <FaUsersCog className="bi bi-people-fill me-1"></FaUsersCog>
                                User Management
                            </Nav.Link>
                        )}

                        {isInstructor && (
                            <Nav.Link as={Link} to="/instructor-schedule" className="mx-2">
                                <FaCalendarWeek className="bi bi-calendar2-week me-1"></FaCalendarWeek>
                                My Schedule
                            </Nav.Link>
                        )}
                        {!isInstructor && (
                            <NavDropdown title="Lecture Management" id="lecture-dropdown">

                                <>
                                    <NavDropdown.Item as={Link} to="/lecture-list">
                                        <FaListAlt className="bi bi-list-check me-1"></FaListAlt>
                                        Lecture List
                                    </NavDropdown.Item>

                                    <NavDropdown.Item as={Link} to="/classroom-management">
                                        <FaSchool className="bi bi-building me-1"></FaSchool>
                                        Classroom Management
                                    </NavDropdown.Item>


                                    <NavDropdown.Item as={Link} to="/management-schedule">
                                        <FaCalendarWeek className="bi bi-calendar2-week me-1"></FaCalendarWeek>
                                        Program Management
                                    </NavDropdown.Item>
                                </>

                            </NavDropdown>

                        )}

                        {/*<NavDropdown title="Exam Operations" id="exam-dropdown">*/}
                        {/*    <NavDropdown.Item>*/}
                        {/*        <i className="bi bi-calendar-event me-1"></i>*/}
                        {/*        Exam Schedule*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item>*/}
                        {/*        <i className="bi bi-plus-circle me-1"></i>*/}
                        {/*        Add Exam*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}




                        <NavDropdown title="Exam Operations" id="exam-dropdown">
                            <NavDropdown.Item as={Link} to="/exam-management">
                                <FaRegCalendarAlt className="bi bi-calendar-event me-1"></FaRegCalendarAlt>
                                Exam Management
                            </NavDropdown.Item>

                            {(isChair || isInstructor) && (
                                <NavDropdown.Item as={Link} to="/exam-seating-arrangement">
                                    <FaChair className="me-1" />
                                    Exam Seating Arrangement
                                </NavDropdown.Item>
                            )}
                        </NavDropdown>

                        <NavDropdown
                            title={<><FaUserCircle className="me-1" /> {user?.email}</>}
                            align="end"
                            id="user-dropdown"
                        >
                            <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                <FaSignOutAlt className="me-1" />
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