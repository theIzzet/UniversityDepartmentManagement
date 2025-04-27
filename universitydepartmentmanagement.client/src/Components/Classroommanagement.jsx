
import React, { useState, useEffect } from 'react';
import {
    Card, Button, Modal, Form, Row, Col, Alert, Badge,
    Spinner, OverlayTrigger, Tooltip, ToastContainer, Container
} from 'react-bootstrap';
import axios from 'axios';
import {
    FaChair, FaChalkboardTeacher, FaEye, FaEdit, FaTrash,
    FaList, FaPlus, FaSearch, FaSyncAlt, FaDoorOpen, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';


import  Navbar from './Navbar'
import '../CSS/ClassroomManagement.css';

const ClassroomManagement = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showLayoutModal, setShowLayoutModal] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        id: 0,
        name: '',
        capacity: 20,
        columns: 3,
        seatsPerColumn: 3
    });

    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        const results = classrooms.filter(classroom =>
            classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classroom.capacity.toString().includes(searchTerm)
        );
        setFilteredClassrooms(results);
    }, [searchTerm, classrooms]);

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/ClassroomManagement');
            setClassrooms(response.data);
            setFilteredClassrooms(response.data);
        } catch (error) {
            toast.error('Failed to fetch classrooms');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLecturesForClassroom = async (classroomId) => {
        try {
            const response = await axios.get(`/api/ClassroomManagement/${classroomId}/lectures`);
            setLectures(response.data);
        } catch (error) {
            toast.error('Failed to fetch lectures');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['id', 'capacity', 'columns', 'seatsPerColumn'].includes(name)
                ? parseInt(value) || 0
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id === 0) {
                await axios.post('/api/ClassroomManagement', formData);
                toast.success('Classroom added successfully');
            } else {
                await axios.put(`/api/ClassroomManagement/${formData.id}`, formData);
                toast.success('Classroom updated successfully');
            }
            setShowModal(false);
            fetchClassrooms();
        } catch (error) {
            toast.error('Operation failed');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this classroom?')) {
            try {
                await axios.delete(`/api/ClassroomManagement/${id}`);
                toast.success('Classroom deleted successfully');
                fetchClassrooms();
                setSelectedClassroom(null);
                setLectures([]);
            } catch (error) {
                toast.error('Delete failed - classroom may have assigned lectures');
                console.error(error);
            }
        }
    };

    const handleShowLectures = async (classroom) => {
        setSelectedClassroom(classroom);
        await fetchLecturesForClassroom(classroom.id);
    };

    const handleShowLayout = (classroom) => {
        setSelectedClassroom(classroom);
        setShowLayoutModal(true);
    };

    const generateClassroomLayout = (classroom) => {
        const { capacity, columns = 3, seatsPerColumn = 3 } = classroom;
        const seatsPerGroup = columns * seatsPerColumn;
        const totalGroups = Math.ceil(capacity / seatsPerGroup);

        let layout = [];
        let seatNumber = 1;

        for (let group = 0; group < totalGroups; group++) {
            let groupSeats = [];
            const seatsInThisGroup = Math.min(seatsPerGroup, capacity - (group * seatsPerGroup));

            for (let col = 0; col < columns; col++) {
                const columnSeats = [];
                const seatsInThisColumn = Math.min(seatsPerColumn, seatsInThisGroup - (col * seatsPerColumn));

                for (let seat = 0; seat < seatsInThisColumn; seat++) {
                    if (seatNumber > capacity) break;
                    columnSeats.push({
                        number: seatNumber++,
                        occupied: false
                    });
                }

                if (columnSeats.length > 0) {
                    groupSeats.push({
                        column: col,
                        seats: columnSeats
                    });
                }
            }

            if (groupSeats.length > 0) {
                layout.push(groupSeats);
            }
        }

        return layout;
    };

    const renderClassroomLayout = (classroom) => {
        if (!classroom) return null;

        const layout = generateClassroomLayout(classroom);
        const { columns, seatsPerColumn, capacity } = classroom;

        return (
            <div className="classroom-layout-container">
                <div className="classroom-header">
                    <div className="classroom-board">
                        <FaChalkboardTeacher size={28} className="board-icon" />
                        <span>Board</span>
                    </div>
                    <div className="classroom-info">
                        <span className="badge bg-primary">{columns} Columns</span>
                        <span className="badge bg-success">{seatsPerColumn} Seats per Column</span>
                        <span className="badge bg-info">{capacity} Total Seats</span>
                    </div>
                    <div className="classroom-door">
                        <FaDoorOpen size={20} className="door-icon" />
                        <span>Door</span>
                    </div>
                </div>

                <div className="seating-area">
                    {layout.map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`} className="seat-group">
                            {group.map((column, colIndex) => (
                                <React.Fragment key={`col-${colIndex}`}>
                                    <div className="seat-column">
                                        {column.seats.map((seat) => (
                                            <motion.div
                                                key={`seat-${seat.number}`}
                                                className={`seat ${seat.occupied ? 'occupied' : 'available'}`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="seat-back"></div>
                                                <div className="seat-bottom"></div>
                                                <div className="seat-top">
                                                    <FaChair className="seat-icon" />
                                                    <span className="seat-number">{seat.number}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {colIndex < group.length - 1 && (
                                        <div className="column-gap">
                                            <div className="aisle-mark"></div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const getCapacityColor = (capacity) => {
        if (capacity < 20) return 'info';
        if (capacity < 50) return 'primary';
        if (capacity < 100) return 'warning';
        return 'danger';
    };

    const getLectureCountColor = (count) => {
        if (count === 0) return 'secondary';
        if (count < 3) return 'success';
        if (count < 5) return 'warning';
        return 'danger';
    };

    return (
        <>
        <Navbar />
        <Container fluid className="classroom-management-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <Row>
                <Col lg={selectedClassroom ? 7 : 12}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h2 className="mb-0">
                                    <FaChalkboardTeacher className="me-2 text-primary" />
                                    Classroom Management
                                </h2>
                                <div>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            setFormData({
                                                id: 0,
                                                name: '',
                                                capacity: 20,
                                                columns: 3,
                                                seatsPerColumn: 3
                                            });
                                            setShowModal(true);
                                        }}
                                        className="me-2"
                                    >
                                        <FaPlus className="me-1" /> Add Classroom
                                    </Button>
                                    <Button variant="outline-secondary" onClick={fetchClassrooms}>
                                        <FaSyncAlt />
                                    </Button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaSearch />
                                    </span>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search classrooms..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading classrooms...</p>
                                </div>
                            ) : filteredClassrooms.length === 0 ? (
                                <Alert variant="info" className="text-center">
                                    No classrooms found. Add a new classroom to get started.
                                </Alert>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th>Capacity</th>
                                                <th>Layout</th>
                                                <th>Lectures</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredClassrooms.map((classroom, index) => (
                                                <motion.tr
                                                    key={classroom.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className={selectedClassroom?.id === classroom.id ? 'table-active' : ''}
                                                >
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <strong>{classroom.name}</strong>
                                                    </td>
                                                    <td>
                                                        <Badge pill bg={getCapacityColor(classroom.capacity)}>
                                                            {classroom.capacity} seats
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        {classroom.columns && classroom.seatsPerColumn ? (
                                                            <small>{classroom.columns} cols × {classroom.seatsPerColumn} seats</small>
                                                        ) : (
                                                            <small className="text-muted">Not configured</small>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Badge pill bg={getLectureCountColor(classroom.lectureCount || 0)}>
                                                            {classroom.lectureCount || 0} lectures
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <OverlayTrigger overlay={<Tooltip>View Layout</Tooltip>}>
                                                                <Button
                                                                    variant="outline-info"
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => handleShowLayout(classroom)}
                                                                >
                                                                    <FaEye />
                                                                </Button>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>List Lectures</Tooltip>}>
                                                                <Button
                                                                    variant="outline-secondary"
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => handleShowLectures(classroom)}
                                                                >
                                                                    <FaList />
                                                                </Button>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                                                                <Button
                                                                    variant="outline-warning"
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => {
                                                                        setFormData({
                                                                            id: classroom.id,
                                                                            name: classroom.name,
                                                                            capacity: classroom.capacity,
                                                                            columns: classroom.columns || 3,
                                                                            seatsPerColumn: classroom.seatsPerColumn || 3
                                                                        });
                                                                        setShowModal(true);
                                                                    }}
                                                                >
                                                                    <FaEdit />
                                                                </Button>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => handleDelete(classroom.id)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {selectedClassroom && (
                    <Col lg={5}>
                        <Card className="shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
                            <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
                                <h5 className="mb-0">
                                    Lectures in {selectedClassroom.name}
                                </h5>
                                <Button
                                    variant="link"
                                    className="text-white p-0"
                                    onClick={() => {
                                        setSelectedClassroom(null);
                                        setLectures([]);
                                    }}
                                >
                                    <FaTimes />
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {lectures.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Code</th>
                                                    <th>Name</th>
                                                    <th>Students</th>
                                                    <th>Instructor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {lectures.map(lecture => (
                                                    <tr key={lecture.id}>
                                                        <td><strong>{lecture.lectureCode}</strong></td>
                                                        <td>{lecture.name}</td>
                                                        <td>{lecture.studentNumber}</td>
                                                        <td>{lecture.instructorName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <Alert variant="info" className="text-center mb-0">
                                        No lectures assigned to this classroom.
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Add/Edit Classroom Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>
                        {formData.id === 0 ? 'Add New Classroom' : 'Edit Classroom'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <input type="hidden" name="id" value={formData.id} />
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Classroom Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Classroom A-101"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formCapacity">
                                    <Form.Label>Capacity</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="capacity"
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formColumns">
                                    <Form.Label>Number of Columns</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="columns"
                                        min="1"
                                        max="10"
                                        value={formData.columns}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formSeatsPerColumn">
                                    <Form.Label>Seats Per Column</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="seatsPerColumn"
                                        min="1"
                                        max="10"
                                        value={formData.seatsPerColumn}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="mb-4">
                            <h6>Layout Preview</h6>
                            <div className="layout-preview-container">
                                {generateClassroomLayout(formData).map((group, groupIndex) => (
                                    <div key={`preview-group-${groupIndex}`} className="preview-group">
                                        {group.map((col, colIndex) => (
                                            <React.Fragment key={`preview-col-${colIndex}`}>
                                                <div className="preview-column">
                                                    {col.seats.map((seat) => (
                                                        <div key={`preview-seat-${seat.number}`} className="preview-seat">
                                                            <FaChair size={12} />
                                                            <span className="preview-seat-number">{seat.number}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {colIndex < group.length - 1 && <div className="preview-gap" />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-2">
                                <small>
                                    {formData.columns * formData.seatsPerColumn} seats per group ×{' '}
                                    {Math.floor(formData.capacity / (formData.columns * formData.seatsPerColumn))} full groups
                                    {formData.capacity % (formData.columns * formData.seatsPerColumn) > 0 && (
                                        <> + 1 group with {formData.capacity % (formData.columns * formData.seatsPerColumn)} seats</>
                                    )}
                                </small>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit">
                                {formData.id === 0 ? 'Add Classroom' : 'Save Changes'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Classroom Layout Modal */}
            <Modal
                show={showLayoutModal}
                onHide={() => setShowLayoutModal(false)}
                size="xl"
                centered
                fullscreen="lg-down"
            >
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title>
                        {selectedClassroom?.name} - Classroom Layout
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClassroom && renderClassroomLayout(selectedClassroom)}
                </Modal.Body>
            </Modal>
            </Container>

        </>
    );
};

export default ClassroomManagement;