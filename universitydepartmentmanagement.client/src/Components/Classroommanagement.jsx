//import React, { useState, useEffect } from 'react';
//import { Table, Button, Modal, Form, Row, Col, Alert, Badge } from 'react-bootstrap';
//import axios from 'axios';

//import { FaChair, FaDoorOpen, FaChalkboardTeacher, FaEye, FaEdit, FaTrash, FaList } from 'react-icons/fa';
//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
//import '../CSS/ClassroomManagement.css';

//const ClassroomManagement = () => {
//    const [classrooms, setClassrooms] = useState([]);
//    const [showModal, setShowModal] = useState(false);
//    const [showLectureModal, setShowLectureModal] = useState(false);
//    const [showViewModal, setShowViewModal] = useState(false);
//    const [selectedClassroom, setSelectedClassroom] = useState(null);
//    const [lectures, setLectures] = useState([]);
//    const [classroomLayout, setClassroomLayout] = useState([]);
//    /*const { user } = useAuth();*/

//    const [formData, setFormData] = useState({
//        id: 0,
//        name: '',
//        capacity: 0,
//        columns: 1,
//        seatsPerColumn: 1
//    });

//    const [layoutConfig, setLayoutConfig] = useState({
//        columns: 1,
//        seatsPerColumn: 1
//    });

//    useEffect(() => {
//        fetchClassrooms();
//    }, []);

//    const fetchClassrooms = async () => {
//        try {
//            const response = await axios.get('/api/ClassroomManagement');
//            setClassrooms(response.data);
//        } catch /*(error)*/ {
//            toast.error('Failed to fetch classrooms');
//        }
//    };

//    const fetchLecturesForClassroom = async (classroomId) => {
//        try {
//            const response = await axios.get(`/api/Lecture?classroomId=${classroomId}`);
//            setLectures(response.data);
//        } catch  {
//            toast.error('Failed to fetch lectures');
//        }
//    };

//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setFormData(prev => ({
//            ...prev,
//            [name]: name === 'id' || name === 'capacity' || name === 'columns' || name === 'seatsPerColumn'
//                ? parseInt(value)
//                : value
//        }));
//    };

//    const handleLayoutConfigChange = (e) => {
//        const { name, value } = e.target;
//        setLayoutConfig(prev => ({
//            ...prev,
//            [name]: parseInt(value)
//        }));
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            if (formData.id === 0) {
//                await axios.post('/api/ClassroomManagement', formData);
//                toast.success('Classroom added successfully');
//            } else {
//                await axios.put(`/api/ClassroomManagement/${formData.id}`, formData);
//                toast.success('Classroom updated successfully');
//            }
//            setShowModal(false);
//            fetchClassrooms();
//        } catch  {
//            toast.error('Operation failed');
//        }
//    };

//    const handleDelete = async (id) => {
//        if (window.confirm('Are you sure you want to delete this classroom?')) {
//            try {
//                await axios.delete(`/api/ClassroomManagement/${id}`);
//                toast.success('Classroom deleted successfully');
//                fetchClassrooms();
//            } catch  {
//                toast.error('Delete failed - classroom may have assigned lectures');
//            }
//        }
//    };

//    const handleViewClassroom = (classroom) => {
//        setSelectedClassroom(classroom);
//        generateClassroomLayout(classroom);
//        setShowViewModal(true);
//    };

//    const generateClassroomLayout = (classroom) => {
//        const { capacity, columns = 1, seatsPerColumn = 1 } = classroom;
//        const seatsPerRow = columns * seatsPerColumn;
//        const fullRows = Math.floor(capacity / seatsPerRow);
//        const remainingSeats = capacity % seatsPerRow;

//        let layout = [];

//        // Generate full rows
//        for (let row = 0; row < fullRows; row++) {
//            let rowSeats = [];
//            for (let col = 0; col < columns; col++) {
//                rowSeats.push({
//                    column: col,
//                    seats: Array(seatsPerColumn).fill({ occupied: false })
//                });
//            }
//            layout.push(rowSeats);
//        }

//        // Generate remaining seats row if needed
//        if (remainingSeats > 0) {
//            let remainingColumns = Math.ceil(remainingSeats / seatsPerColumn);
//            let rowSeats = [];

//            for (let col = 0; col < remainingColumns; col++) {
//                const seatsInThisColumn = col === remainingColumns - 1
//                    ? remainingSeats % seatsPerColumn || seatsPerColumn
//                    : seatsPerColumn;

//                rowSeats.push({
//                    column: col,
//                    seats: Array(seatsInThisColumn).fill({ occupied: false })
//                });
//            }
//            layout.push(rowSeats);
//        }

//        setClassroomLayout(layout);
//    };

//    const handleShowLectures = async (classroom) => {
//        setSelectedClassroom(classroom);
//        await fetchLecturesForClassroom(classroom.id);
//        setShowLectureModal(true);
//    };

//    const handleUpdateLayout = async () => {
//        try {
//            await axios.put(`/api/ClassroomManagement/${selectedClassroom.id}`, {
//                ...selectedClassroom,
//                columns: layoutConfig.columns,
//                seatsPerColumn: layoutConfig.seatsPerColumn
//            });
//            toast.success('Classroom layout updated successfully');
//            generateClassroomLayout({
//                ...selectedClassroom,
//                columns: layoutConfig.columns,
//                seatsPerColumn: layoutConfig.seatsPerColumn
//            });
//            fetchClassrooms();
//        } catch  {
//            toast.error('Failed to update layout');
//        }
//    };

//    return (
//        <div className="classroom-management-container">
//            <div className="d-flex justify-content-between align-items-center mb-4">
//                <h2><FaChalkboardTeacher className="me-2" /> Classroom Management</h2>
//                <Button variant="primary" onClick={() => {
//                    setFormData({ id: 0, name: '', capacity: 0, columns: 1, seatsPerColumn: 1 });
//                    setShowModal(true);
//                }}>
//                    Add New Classroom
//                </Button>
//            </div>

//            <Table striped bordered hover responsive className="classroom-table">
//                <thead>
//                    <tr>
//                        <th>#</th>
//                        <th>Name</th>
//                        <th>Capacity</th>
//                        <th>Layout</th>
//                        <th>Actions</th>
//                    </tr>
//                </thead>
//                <tbody>
//                    {classrooms.map((classroom, index) => (
//                        <tr key={classroom.id}>
//                            <td>{index + 1}</td>
//                            <td>{classroom.name}</td>
//                            <td>
//                                <Badge bg="info">{classroom.capacity}</Badge>
//                            </td>
//                            <td>
//                                {classroom.columns && classroom.seatsPerColumn ? (
//                                    <small>{classroom.columns} columns × {classroom.seatsPerColumn} seats</small>
//                                ) : (
//                                    <small className="text-muted">Not configured</small>
//                                )}
//                            </td>
//                            <td>
//                                <Button variant="info" size="sm" className="me-2"
//                                    onClick={() => handleViewClassroom(classroom)}>
//                                    <FaEye /> View
//                                </Button>
//                                <Button variant="warning" size="sm" className="me-2"
//                                    onClick={() => {
//                                        setFormData({
//                                            id: classroom.id,
//                                            name: classroom.name,
//                                            capacity: classroom.capacity,
//                                            columns: classroom.columns || 1,
//                                            seatsPerColumn: classroom.seatsPerColumn || 1
//                                        });
//                                        setShowModal(true);
//                                    }}>
//                                    <FaEdit /> Edit
//                                </Button>
//                                <Button variant="danger" size="sm" className="me-2"
//                                    onClick={() => handleDelete(classroom.id)}>
//                                    <FaTrash /> Delete
//                                </Button>
//                                <Button variant="secondary" size="sm"
//                                    onClick={() => handleShowLectures(classroom)}>
//                                    <FaList /> Lectures
//                                </Button>
//                            </td>
//                        </tr>
//                    ))}
//                </tbody>
//            </Table>

//            {/* Add/Edit Classroom Modal */}
//            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//                <Modal.Header closeButton>
//                    <Modal.Title>{formData.id === 0 ? 'Add New Classroom' : 'Edit Classroom'}</Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <Form onSubmit={handleSubmit}>
//                        <input type="hidden" name="id" value={formData.id} />
//                        <Row className="mb-3">
//                            <Col md={6}>
//                                <Form.Group controlId="formName">
//                                    <Form.Label>Classroom Name</Form.Label>
//                                    <Form.Control
//                                        type="text"
//                                        name="name"
//                                        value={formData.name}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                            <Col md={6}>
//                                <Form.Group controlId="formCapacity">
//                                    <Form.Label>Capacity</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="capacity"
//                                        min="1"
//                                        value={formData.capacity}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                        </Row>
//                        {formData.id !== 0 && (
//                            <Row className="mb-3">
//                                <Col md={6}>
//                                    <Form.Group controlId="formColumns">
//                                        <Form.Label>Columns</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="columns"
//                                            min="1"
//                                            max="10"
//                                            value={formData.columns}
//                                            onChange={handleInputChange}
//                                        />
//                                    </Form.Group>
//                                </Col>
//                                <Col md={6}>
//                                    <Form.Group controlId="formSeatsPerColumn">
//                                        <Form.Label>Seats Per Column</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="seatsPerColumn"
//                                            min="1"
//                                            max="10"
//                                            value={formData.seatsPerColumn}
//                                            onChange={handleInputChange}
//                                        />
//                                    </Form.Group>
//                                </Col>
//                            </Row>
//                        )}
//                        <div className="d-flex justify-content-end mt-4">
//                            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
//                                Cancel
//                            </Button>
//                            <Button variant="primary" type="submit">
//                                Save
//                            </Button>
//                        </div>
//                    </Form>
//                </Modal.Body>
//            </Modal>

//            {/* View Classroom Layout Modal */}
//            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="xl" fullscreen="lg-down">
//                <Modal.Header closeButton>
//                    <Modal.Title>
//                        {selectedClassroom?.name} - Capacity: {selectedClassroom?.capacity}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <Row>
//                        <Col md={8}>
//                            <div className="classroom-layout-container">
//                                <div className="classroom-board">
//                                    <FaChalkboardTeacher size={30} /> Board
//                                </div>
//                                <div className="classroom-door">
//                                    <FaDoorOpen size={20} /> Door
//                                </div>
//                                <div className="classroom-seats">
//                                    {classroomLayout.map((row, rowIndex) => (
//                                        <div key={`row-${rowIndex}`} className="classroom-row">
//                                            {row.map((col, colIndex) => (
//                                                <div key={`col-${colIndex}`} className="classroom-column-group">
//                                                    {col.seats.map((seat, seatIndex) => (
//                                                        <div key={`seat-${seatIndex}`} className="classroom-seat">
//                                                            <FaChair className={seat.occupied ? "seat-occupied" : "seat-available"} />
//                                                        </div>
//                                                    ))}
//                                                    {colIndex < row.length - 1 && (
//                                                        <div className="column-gap"></div>
//                                                    )}
//                                                </div>
//                                            ))}
//                                        </div>
//                                    ))}
//                                </div>
//                            </div>
//                        </Col>
//                        <Col md={4}>
//                            <div className="layout-configuration">
//                                <h5>Layout Configuration</h5>
//                                <Form>
//                                    <Form.Group className="mb-3">
//                                        <Form.Label>Number of Columns</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="columns"
//                                            min="1"
//                                            max="10"
//                                            value={layoutConfig.columns}
//                                            onChange={handleLayoutConfigChange}
//                                        />
//                                    </Form.Group>
//                                    <Form.Group className="mb-3">
//                                        <Form.Label>Seats Per Column</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="seatsPerColumn"
//                                            min="1"
//                                            max="10"
//                                            value={layoutConfig.seatsPerColumn}
//                                            onChange={handleLayoutConfigChange}
//                                        />
//                                    </Form.Group>
//                                    <Button
//                                        variant="primary"
//                                        onClick={handleUpdateLayout}
//                                        disabled={
//                                            (layoutConfig.columns === selectedClassroom?.columns &&
//                                                layoutConfig.seatsPerColumn === selectedClassroom?.seatsPerColumn) ||
//                                            !layoutConfig.columns ||
//                                            !layoutConfig.seatsPerColumn
//                                        }
//                                    >
//                                        Update Layout
//                                    </Button>
//                                </Form>
//                                <div className="layout-preview mt-4">
//                                    <h6>Preview</h6>
//                                    <div className="preview-row">
//                                        {Array.from({ length: layoutConfig.columns }).map((_, i) => (
//                                            <React.Fragment key={`preview-col-${i}`}>
//                                                <div className="preview-column">
//                                                    {Array.from({ length: layoutConfig.seatsPerColumn }).map((_, j) => (
//                                                        <FaChair key={`preview-seat-${j}`} className="seat-preview" />
//                                                    ))}
//                                                </div>
//                                                {i < layoutConfig.columns - 1 && <div className="preview-gap"></div>}
//                                            </React.Fragment>
//                                        ))}
//                                    </div>
//                                    <div className="mt-2">
//                                        <small>
//                                            Total per row: {layoutConfig.columns * layoutConfig.seatsPerColumn} seats
//                                        </small>
//                                    </div>
//                                </div>
//                            </div>
//                        </Col>
//                    </Row>
//                </Modal.Body>
//            </Modal>

//            {/* Lectures Modal */}
//            <Modal show={showLectureModal} onHide={() => setShowLectureModal(false)}>
//                <Modal.Header closeButton>
//                    <Modal.Title>
//                        Lectures in {selectedClassroom?.name}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    {lectures.length > 0 ? (
//                        <Table striped bordered hover size="sm">
//                            <thead>
//                                <tr>
//                                    <th>Name</th>
//                                    <th>Code</th>
//                                    <th>Students</th>
//                                </tr>
//                            </thead>
//                            <tbody>
//                                {lectures.map(lecture => (
//                                    <tr key={lecture.id}>
//                                        <td>{lecture.name}</td>
//                                        <td>{lecture.lectureCode}</td>
//                                        <td>{lecture.studentNumber}</td>
//                                    </tr>
//                                ))}
//                            </tbody>
//                        </Table>
//                    ) : (
//                        <Alert variant="info">
//                            No lectures assigned to this classroom.
//                        </Alert>
//                    )}
//                </Modal.Body>
//                <Modal.Footer>
//                    <Button variant="secondary" onClick={() => setShowLectureModal(false)}>
//                        Close
//                    </Button>
//                </Modal.Footer>
//            </Modal>
//        </div>
//    );
//};

//export default ClassroomManagement;












//import React, { useState, useEffect } from 'react';
//import {
//    Table, Button, Modal, Form, Row, Col, Alert, Badge,
//    Card, Spinner, OverlayTrigger, Tooltip, Toast, ToastContainer
//} from 'react-bootstrap';
//import axios from 'axios';
//import {
//    FaChair, FaDoorOpen, FaChalkboardTeacher, FaEye,
//    FaEdit, FaTrash, FaList, FaPlus, FaSearch, FaSyncAlt
//} from 'react-icons/fa';
//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
//import { motion, AnimatePresence } from 'framer-motion';
///*import { useAuth } from '../Contexts/AuthContext';*/
//import '../CSS/ClassroomManagement.css';

//const ClassroomManagement = () => {
//    const [classrooms, setClassrooms] = useState([]);
//    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
//    const [showModal, setShowModal] = useState(false);
//    const [showLectureModal, setShowLectureModal] = useState(false);
//    const [showViewModal, setShowViewModal] = useState(false);
//    const [selectedClassroom, setSelectedClassroom] = useState(null);
//    const [lectures, setLectures] = useState([]);
//    const [classroomLayout, setClassroomLayout] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [searchTerm, setSearchTerm] = useState('');
//  /*  const { user } = useAuth();*/

//    const [formData, setFormData] = useState({
//        id: 0,
//        name: '',
//        capacity: 0,
//        columns: 1,
//        seatsPerColumn: 1
//    });

//    const [layoutConfig, setLayoutConfig] = useState({
//        columns: 1,
//        seatsPerColumn: 1
//    });

//    useEffect(() => {
//        fetchClassrooms();
//    }, []);

//    useEffect(() => {
//        const results = classrooms.filter(classroom =>
//            classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//            classroom.capacity.toString().includes(searchTerm)
//        );
//        setFilteredClassrooms(results);
//    }, [searchTerm, classrooms]);

//    const fetchClassrooms = async () => {
//        try {
//            setLoading(true);
//            const response = await axios.get('/api/ClassroomManagement');
//            setClassrooms(response.data);
//            setFilteredClassrooms(response.data);
//            toast.success('Classrooms loaded successfully');
//        } catch (error) {
//            toast.error('Failed to fetch classrooms');
//            console.error(error);
//        } finally {
//            setLoading(false);
//        }
//    };

//    const fetchLecturesForClassroom = async (classroomId) => {
//        try {
//            const response = await axios.get(`/api/ClassroomManagement/${classroomId}/lectures`);
//            setLectures(response.data);
//        } catch (error) {
//            toast.error('Failed to fetch lectures');
//            console.error(error);
//        }
//    };

//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setFormData(prev => ({
//            ...prev,
//            [name]: name === 'id' || name === 'capacity' || name === 'columns' || name === 'seatsPerColumn'
//                ? parseInt(value)
//                : value
//        }));
//    };

//    const handleLayoutConfigChange = (e) => {
//        const { name, value } = e.target;
//        setLayoutConfig(prev => ({
//            ...prev,
//            [name]: parseInt(value)
//        }));
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            if (formData.id === 0) {
//                await axios.post('/api/ClassroomManagement', formData);
//                toast.success('Classroom added successfully');
//            } else {
//                await axios.put(`/api/ClassroomManagement/${formData.id}`, formData);
//                toast.success('Classroom updated successfully');
//            }
//            setShowModal(false);
//            fetchClassrooms();
//        } catch (error) {
//            toast.error('Operation failed');
//            console.error(error);
//        }
//    };

//    const handleDelete = async (id) => {
//        if (window.confirm('Are you sure you want to delete this classroom?')) {
//            try {
//                await axios.delete(`/api/ClassroomManagement/${id}`);
//                toast.success('Classroom deleted successfully');
//                fetchClassrooms();
//            } catch (error) {
//                toast.error('Delete failed - classroom may have assigned lectures');
//                console.error(error);
//            }
//        }
//    };

//    const handleViewClassroom = (classroom) => {
//        setSelectedClassroom(classroom);
//        generateClassroomLayout(classroom);
//        setShowViewModal(true);
//    };

//    const generateClassroomLayout = (classroom) => {
//        const { capacity, columns = 1, seatsPerColumn = 1 } = classroom;
//        const seatsPerRow = columns * seatsPerColumn;
//        const fullRows = Math.floor(capacity / seatsPerRow);
//        const remainingSeats = capacity % seatsPerRow;

//        let layout = [];

//        // Generate full rows
//        for (let row = 0; row < fullRows; row++) {
//            let rowSeats = [];
//            for (let col = 0; col < columns; col++) {
//                rowSeats.push({
//                    column: col,
//                    seats: Array(seatsPerColumn).fill({ occupied: false })
//                });
//            }
//            layout.push(rowSeats);
//        }

//        // Generate remaining seats row if needed
//        if (remainingSeats > 0) {
//            let remainingColumns = Math.ceil(remainingSeats / seatsPerColumn);
//            let rowSeats = [];

//            for (let col = 0; col < remainingColumns; col++) {
//                const seatsInThisColumn = col === remainingColumns - 1
//                    ? remainingSeats % seatsPerColumn || seatsPerColumn
//                    : seatsPerColumn;

//                rowSeats.push({
//                    column: col,
//                    seats: Array(seatsInThisColumn).fill({ occupied: false })
//                });
//            }
//            layout.push(rowSeats);
//        }

//        setClassroomLayout(layout);
//    };

//    const handleShowLectures = async (classroom) => {
//        setSelectedClassroom(classroom);
//        await fetchLecturesForClassroom(classroom.id);
//        setShowLectureModal(true);
//    };

//    const handleUpdateLayout = async () => {
//        try {
//            await axios.put(`/api/ClassroomManagement/${selectedClassroom.id}`, {
//                ...selectedClassroom,
//                columns: layoutConfig.columns,
//                seatsPerColumn: layoutConfig.seatsPerColumn
//            });
//            toast.success('Classroom layout updated successfully');
//            generateClassroomLayout({
//                ...selectedClassroom,
//                columns: layoutConfig.columns,
//                seatsPerColumn: layoutConfig.seatsPerColumn
//            });
//            fetchClassrooms();
//        } catch (error) {
//            toast.error('Failed to update layout');
//            console.error(error);
//        }
//    };

//    const getCapacityColor = (capacity) => {
//        if (capacity < 20) return 'info';
//        if (capacity < 50) return 'primary';
//        if (capacity < 100) return 'warning';
//        return 'danger';
//    };

//    const getLectureCountColor = (count) => {
//        if (count === 0) return 'secondary';
//        if (count < 3) return 'success';
//        if (count < 5) return 'warning';
//        return 'danger';
//    };

//    return (
//        <motion.div
//            initial={{ opacity: 0 }}
//            animate={{ opacity: 1 }}
//            transition={{ duration: 0.5 }}
//            className="classroom-management-container"
//        >
//            <ToastContainer position="top-right" autoClose={3000} />

//            <Card className="shadow-sm mb-4">
//                <Card.Body>
//                    <div className="d-flex justify-content-between align-items-center mb-4">
//                        <h2 className="mb-0">
//                            <FaChalkboardTeacher className="me-2 text-primary" />
//                            Classroom Management
//                        </h2>
//                        <div>
//                            <Button
//                                variant="primary"
//                                onClick={() => {
//                                    setFormData({ id: 0, name: '', capacity: 0, columns: 1, seatsPerColumn: 1 });
//                                    setShowModal(true);
//                                }}
//                                className="me-2"
//                            >
//                                <FaPlus className="me-1" /> Add Classroom
//                            </Button>
//                            <Button variant="outline-secondary" onClick={fetchClassrooms}>
//                                <FaSyncAlt />
//                            </Button>
//                        </div>
//                    </div>

//                    <div className="mb-3">
//                        <div className="input-group">
//                            <span className="input-group-text">
//                                <FaSearch />
//                            </span>
//                            <Form.Control
//                                type="text"
//                                placeholder="Search classrooms..."
//                                value={searchTerm}
//                                onChange={(e) => setSearchTerm(e.target.value)}
//                            />
//                        </div>
//                    </div>

//                    {loading ? (
//                        <div className="text-center py-5">
//                            <Spinner animation="border" variant="primary" />
//                            <p className="mt-2">Loading classrooms...</p>
//                        </div>
//                    ) : filteredClassrooms.length === 0 ? (
//                        <Alert variant="info" className="text-center">
//                            No classrooms found. Add a new classroom to get started.
//                        </Alert>
//                    ) : (
//                        <div className="table-responsive">
//                            <Table striped bordered hover className="mb-0">
//                                <thead className="table-dark">
//                                    <tr>
//                                        <th>#</th>
//                                        <th>Name</th>
//                                        <th>Capacity</th>
//                                        <th>Layout</th>
//                                        <th>Lectures</th>
//                                        <th>Actions</th>
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    {filteredClassrooms.map((classroom, index) => (
//                                        <motion.tr
//                                            key={classroom.id}
//                                            initial={{ opacity: 0, y: 10 }}
//                                            animate={{ opacity: 1, y: 0 }}
//                                            transition={{ duration: 0.3, delay: index * 0.05 }}
//                                        >
//                                            <td>{index + 1}</td>
//                                            <td>
//                                                <strong>{classroom.name}</strong>
//                                            </td>
//                                            <td>
//                                                <Badge pill bg={getCapacityColor(classroom.capacity)}>
//                                                    {classroom.capacity} seats
//                                                </Badge>
//                                            </td>
//                                            <td>
//                                                {classroom.columns && classroom.seatsPerColumn ? (
//                                                    <small>{classroom.columns} cols × {classroom.seatsPerColumn} seats</small>
//                                                ) : (
//                                                    <small className="text-muted">Not configured</small>
//                                                )}
//                                            </td>
//                                            <td>
//                                                <Badge pill bg={getLectureCountColor(classroom.lectureCount || 0)}>
//                                                    {classroom.lectureCount || 0} lectures
//                                                </Badge>
//                                            </td>
//                                            <td>
//                                                <div className="d-flex">
//                                                    <OverlayTrigger
//                                                        placement="top"
//                                                        overlay={<Tooltip>View Layout</Tooltip>}
//                                                    >
//                                                        <Button
//                                                            variant="outline-info"
//                                                            size="sm"
//                                                            className="me-2"
//                                                            onClick={() => handleViewClassroom(classroom)}
//                                                        >
//                                                            <FaEye />
//                                                        </Button>
//                                                    </OverlayTrigger>
//                                                    <OverlayTrigger
//                                                        placement="top"
//                                                        overlay={<Tooltip>Edit</Tooltip>}
//                                                    >
//                                                        <Button
//                                                            variant="outline-warning"
//                                                            size="sm"
//                                                            className="me-2"
//                                                            onClick={() => {
//                                                                setFormData({
//                                                                    id: classroom.id,
//                                                                    name: classroom.name,
//                                                                    capacity: classroom.capacity,
//                                                                    columns: classroom.columns || 1,
//                                                                    seatsPerColumn: classroom.seatsPerColumn || 1
//                                                                });
//                                                                setShowModal(true);
//                                                            }}
//                                                        >
//                                                            <FaEdit />
//                                                        </Button>
//                                                    </OverlayTrigger>
//                                                    <OverlayTrigger
//                                                        placement="top"
//                                                        overlay={<Tooltip>Delete</Tooltip>}
//                                                    >
//                                                        <Button
//                                                            variant="outline-danger"
//                                                            size="sm"
//                                                            className="me-2"
//                                                            onClick={() => handleDelete(classroom.id)}
//                                                        >
//                                                            <FaTrash />
//                                                        </Button>
//                                                    </OverlayTrigger>
//                                                    <OverlayTrigger
//                                                        placement="top"
//                                                        overlay={<Tooltip>View Lectures</Tooltip>}
//                                                    >
//                                                        <Button
//                                                            variant="outline-secondary"
//                                                            size="sm"
//                                                            onClick={() => handleShowLectures(classroom)}
//                                                        >
//                                                            <FaList />
//                                                        </Button>
//                                                    </OverlayTrigger>
//                                                </div>
//                                            </td>
//                                        </motion.tr>
//                                    ))}
//                                </tbody>
//                            </Table>
//                        </div>
//                    )}
//                </Card.Body>
//            </Card>

//            {/* Add/Edit Classroom Modal */}
//            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        {formData.id === 0 ? 'Add New Classroom' : 'Edit Classroom'}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <Form onSubmit={handleSubmit}>
//                        <input type="hidden" name="id" value={formData.id} />
//                        <Row className="mb-3">
//                            <Col md={6}>
//                                <Form.Group controlId="formName">
//                                    <Form.Label>Classroom Name</Form.Label>
//                                    <Form.Control
//                                        type="text"
//                                        name="name"
//                                        value={formData.name}
//                                        onChange={handleInputChange}
//                                        required
//                                        placeholder="e.g., Classroom A-101"
//                                    />
//                                </Form.Group>
//                            </Col>
//                            <Col md={6}>
//                                <Form.Group controlId="formCapacity">
//                                    <Form.Label>Capacity</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="capacity"
//                                        min="1"
//                                        value={formData.capacity}
//                                        onChange={handleInputChange}
//                                        required
//                                        placeholder="Enter capacity"
//                                    />
//                                </Form.Group>
//                            </Col>
//                        </Row>
//                        {formData.id !== 0 && (
//                            <Row className="mb-3">
//                                <Col md={6}>
//                                    <Form.Group controlId="formColumns">
//                                        <Form.Label>Columns</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="columns"
//                                            min="1"
//                                            max="10"
//                                            value={formData.columns}
//                                            onChange={handleInputChange}
//                                            placeholder="Number of columns"
//                                        />
//                                    </Form.Group>
//                                </Col>
//                                <Col md={6}>
//                                    <Form.Group controlId="formSeatsPerColumn">
//                                        <Form.Label>Seats Per Column</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="seatsPerColumn"
//                                            min="1"
//                                            max="10"
//                                            value={formData.seatsPerColumn}
//                                            onChange={handleInputChange}
//                                            placeholder="Seats per column"
//                                        />
//                                    </Form.Group>
//                                </Col>
//                            </Row>
//                        )}
//                        <div className="d-flex justify-content-end mt-4">
//                            <Button
//                                variant="outline-secondary"
//                                className="me-2"
//                                onClick={() => setShowModal(false)}
//                            >
//                                Cancel
//                            </Button>
//                            <Button variant="primary" type="submit">
//                                {formData.id === 0 ? 'Add Classroom' : 'Save Changes'}
//                            </Button>
//                        </div>
//                    </Form>
//                </Modal.Body>
//            </Modal>

//            {/* View Classroom Layout Modal */}
//            <Modal
//                show={showViewModal}
//                onHide={() => setShowViewModal(false)}
//                size="xl"
//                fullscreen="lg-down"
//                centered
//            >
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        {selectedClassroom?.name} - Capacity: {selectedClassroom?.capacity} seats
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <Row>
//                        <Col md={8}>
//                            <div className="classroom-layout-container">
//                                <div className="classroom-board">
//                                    <FaChalkboardTeacher size={30} /> Board
//                                </div>
//                                <div className="classroom-door">
//                                    <FaDoorOpen size={20} /> Door
//                                </div>
//                                <div className="classroom-seats">
//                                    {classroomLayout.map((row, rowIndex) => (
//                                        <div key={`row-${rowIndex}`} className="classroom-row">
//                                            {row.map((col, colIndex) => (
//                                                <motion.div
//                                                    key={`col-${colIndex}`}
//                                                    className="classroom-column-group"
//                                                    whileHover={{ scale: 1.05 }}
//                                                >
//                                                    {col.seats.map((seat, seatIndex) => (
//                                                        <motion.div
//                                                            key={`seat-${seatIndex}`}
//                                                            className="classroom-seat"
//                                                            whileHover={{ scale: 1.1 }}
//                                                        >
//                                                            <FaChair className={seat.occupied ? "seat-occupied" : "seat-available"} />
//                                                        </motion.div>
//                                                    ))}
//                                                    {colIndex < row.length - 1 && (
//                                                        <div className="column-gap"></div>
//                                                    )}
//                                                </motion.div>
//                                            ))}
//                                        </div>
//                                    ))}
//                                </div>
//                            </div>
//                        </Col>
//                        <Col md={4}>
//                            <div className="layout-configuration">
//                                <h5 className="mb-4">Layout Configuration</h5>
//                                <Form>
//                                    <Form.Group className="mb-3">
//                                        <Form.Label>Number of Columns</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="columns"
//                                            min="1"
//                                            max="10"
//                                            value={layoutConfig.columns}
//                                            onChange={handleLayoutConfigChange}
//                                        />
//                                    </Form.Group>
//                                    <Form.Group className="mb-3">
//                                        <Form.Label>Seats Per Column</Form.Label>
//                                        <Form.Control
//                                            type="number"
//                                            name="seatsPerColumn"
//                                            min="1"
//                                            max="10"
//                                            value={layoutConfig.seatsPerColumn}
//                                            onChange={handleLayoutConfigChange}
//                                        />
//                                    </Form.Group>
//                                    <Button
//                                        variant="primary"
//                                        onClick={handleUpdateLayout}
//                                        disabled={
//                                            (layoutConfig.columns === selectedClassroom?.columns &&
//                                                layoutConfig.seatsPerColumn === selectedClassroom?.seatsPerColumn) ||
//                                            !layoutConfig.columns ||
//                                            !layoutConfig.seatsPerColumn
//                                        }
//                                        className="w-100 mb-3"
//                                    >
//                                        Update Layout
//                                    </Button>
//                                </Form>
//                                <div className="layout-preview mt-4 p-3 border rounded">
//                                    <h6>Layout Preview</h6>
//                                    <div className="preview-row">
//                                        {Array.from({ length: layoutConfig.columns }).map((_, i) => (
//                                            <React.Fragment key={`preview-col-${i}`}>
//                                                <div className="preview-column">
//                                                    {Array.from({ length: layoutConfig.seatsPerColumn }).map((_, j) => (
//                                                        <FaChair
//                                                            key={`preview-seat-${j}`}
//                                                            className="seat-preview"
//                                                            size={20}
//                                                        />
//                                                    ))}
//                                                </div>
//                                                {i < layoutConfig.columns - 1 && <div className="preview-gap"></div>}
//                                            </React.Fragment>
//                                        ))}
//                                    </div>
//                                    <div className="mt-2 text-muted">
//                                        <small>
//                                            Total per row: {layoutConfig.columns * layoutConfig.seatsPerColumn} seats
//                                        </small>
//                                    </div>
//                                </div>
//                            </div>
//                        </Col>
//                    </Row>
//                </Modal.Body>
//            </Modal>

//            {/* Lectures Modal */}
//            <Modal
//                show={showLectureModal}
//                onHide={() => setShowLectureModal(false)}
//                size="lg"
//                centered
//            >
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        Lectures in {selectedClassroom?.name}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    {lectures.length > 0 ? (
//                        <div className="table-responsive">
//                            <Table striped bordered hover>
//                                <thead>
//                                    <tr>
//                                        <th>Code</th>
//                                        <th>Name</th>
//                                        <th>Language</th>
//                                        <th>Students</th>
//                                        <th>Instructor</th>
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    {lectures.map(lecture => (
//                                        <tr key={lecture.id}>
//                                            <td><strong>{lecture.lectureCode}</strong></td>
//                                            <td>{lecture.name}</td>
//                                            <td>{lecture.language}</td>
//                                            <td>{lecture.studentNumber}</td>
//                                            <td>{lecture.instructorName}</td>
//                                        </tr>
//                                    ))}
//                                </tbody>
//                            </Table>
//                        </div>
//                    ) : (
//                        <Alert variant="info" className="text-center">
//                            No lectures assigned to this classroom.
//                        </Alert>
//                    )}
//                </Modal.Body>
//                <Modal.Footer>
//                    <Button
//                        variant="secondary"
//                        onClick={() => setShowLectureModal(false)}
//                    >
//                        Close
//                    </Button>
//                </Modal.Footer>
//            </Modal>
//        </motion.div>
//    );
//};

//export default ClassroomManagement;











//import React, { useState, useEffect } from 'react';
//import {
//    Card, Button, Modal, Form, Row, Col, Alert, Badge,
//    Spinner, OverlayTrigger, Tooltip, ToastContainer, Container
//} from 'react-bootstrap';
//import axios from 'axios';
//import {
//    FaChair, FaChalkboardTeacher, FaEye, FaEdit, FaTrash,
//    FaList, FaPlus, FaSearch, FaSyncAlt, FaDoorOpen, FaTimes
//} from 'react-icons/fa';
//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
//import { motion, AnimatePresence } from 'framer-motion';
//import '../CSS/ClassroomManagement.css';

//const ClassroomManagement = () => {
//    const [classrooms, setClassrooms] = useState([]);
//    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
//    const [showModal, setShowModal] = useState(false);
//    const [showLectureModal, setShowLectureModal] = useState(false);
//    const [selectedClassroom, setSelectedClassroom] = useState(null);
//    const [lectures, setLectures] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [searchTerm, setSearchTerm] = useState('');
// /*   const [previewMode, setPreviewMode] = useState(false);*/

//    const [formData, setFormData] = useState({
//        id: 0,
//        name: '',
//        capacity: 20,
//        columns: 2,
//        seatsPerColumn: 2
//    });

//    useEffect(() => {
//        fetchClassrooms();
//    }, []);

//    useEffect(() => {
//        const results = classrooms.filter(classroom =>
//            classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//            classroom.capacity.toString().includes(searchTerm)
//        );
//        setFilteredClassrooms(results);
//    }, [searchTerm, classrooms]);

//    const fetchClassrooms = async () => {
//        try {
//            setLoading(true);
//            const response = await axios.get('/api/ClassroomManagement');
//            setClassrooms(response.data);
//            setFilteredClassrooms(response.data);
//        } catch (error) {
//            toast.error('Failed to fetch classrooms');
//            console.error(error);
//        } finally {
//            setLoading(false);
//        }
//    };

//    const fetchLecturesForClassroom = async (classroomId) => {
//        try {
//            const response = await axios.get(`/api/ClassroomManagement/${classroomId}/lectures`);
//            setLectures(response.data);
//        } catch (error) {
//            toast.error('Failed to fetch lectures');
//            console.error(error);
//        }
//    };

//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setFormData(prev => ({
//            ...prev,
//            [name]: ['id', 'capacity', 'columns', 'seatsPerColumn'].includes(name)
//                ? parseInt(value) || 0
//                : value
//        }));
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            if (formData.id === 0) {
//                await axios.post('/api/ClassroomManagement', formData);
//                toast.success('Classroom added successfully');
//            } else {
//                await axios.put(`/api/ClassroomManagement/${formData.id}`, formData);
//                toast.success('Classroom updated successfully');
//            }
//            setShowModal(false);
//            fetchClassrooms();
//        } catch (error) {
//            toast.error('Operation failed');
//            console.error(error);
//        }
//    };

//    const handleDelete = async (id) => {
//        if (window.confirm('Are you sure you want to delete this classroom?')) {
//            try {
//                await axios.delete(`/api/ClassroomManagement/${id}`);
//                toast.success('Classroom deleted successfully');
//                fetchClassrooms();
//                setSelectedClassroom(null);
//            } catch (error) {
//                toast.error('Delete failed - classroom may have assigned lectures');
//                console.error(error);
//            }
//        }
//    };

//    const handleShowLectures = async (classroom) => {
//        setSelectedClassroom(classroom);
//        await fetchLecturesForClassroom(classroom.id);
//        setShowLectureModal(true);
//    };

//    const generateClassroomLayout = (classroom) => {
//        const { capacity, columns = 2, seatsPerColumn = 2 } = classroom;
//        const seatsPerRow = columns * seatsPerColumn;
//        const fullRows = Math.floor(capacity / seatsPerRow);
//        const remainingSeats = capacity % seatsPerRow;

//        let layout = [];

//        // Generate full rows
//        for (let row = 0; row < fullRows; row++) {
//            let rowSeats = [];
//            for (let col = 0; col < columns; col++) {
//                rowSeats.push({
//                    column: col,
//                    seats: Array(seatsPerColumn).fill({ occupied: false })
//                });
//            }
//            layout.push(rowSeats);
//        }

//        // Generate remaining seats row if needed
//        if (remainingSeats > 0) {
//            let remainingColumns = Math.ceil(remainingSeats / seatsPerColumn);
//            let rowSeats = [];

//            for (let col = 0; col < remainingColumns; col++) {
//                const seatsInThisColumn = col === remainingColumns - 1
//                    ? remainingSeats % seatsPerColumn || seatsPerColumn
//                    : seatsPerColumn;

//                rowSeats.push({
//                    column: col,
//                    seats: Array(seatsInThisColumn).fill({ occupied: false })
//                });
//            }
//            layout.push(rowSeats);
//        }

//        return layout;
//    };

//    //const renderClassroomLayout = (classroom) => {
//    //    if (!classroom) return null;

//    //    const layout = generateClassroomLayout(classroom);
//    //    const { columns, seatsPerColumn } = classroom;

//    //    return (
//    //        <div className="classroom-layout-preview">
//    //            <div className="classroom-board">
//    //                <FaChalkboardTeacher size={24} /> Board
//    //            </div>
//    //            <div className="classroom-door">
//    //                <FaDoorOpen size={18} /> Door
//    //            </div>

//    //            <div className="classroom-seats-container">
//    //                {layout.map((row, rowIndex) => (
//    //                    <div key={`row-${rowIndex}`} className="classroom-row">
//    //                        {row.map((col, colIndex) => (
//    //                            <React.Fragment key={`col-${colIndex}`}>
//    //                                <div className="classroom-column-group">
//    //                                    {col.seats.map((seat, seatIndex) => (
//    //                                        <motion.div
//    //                                            key={`seat-${seatIndex}`}
//    //                                            className="classroom-seat"
//    //                                            whileHover={{ scale: 1.1 }}
//    //                                            whileTap={{ scale: 0.95 }}
//    //                                        >
//    //                                            <FaChair className="seat-available" />
//    //                                            <span className="seat-number">
//    //                                                {rowIndex * columns * seatsPerColumn + colIndex * seatsPerColumn + seatIndex + 1}
//    //                                            </span>
//    //                                        </motion.div>
//    //                                    ))}
//    //                                </div>
//    //                                {colIndex < row.length - 1 && <div className="column-gap" />}
//    //                            </React.Fragment>
//    //                        ))}
//    //                    </div>
//    //                ))}
//    //            </div>
//    //        </div>
//    //    );
//    //};


//    // Updated renderClassroomLayout function in ClassroomManagement.jsx
//const renderClassroomLayout = (classroom) => {
//    if (!classroom) return null;

//    const layout = generateClassroomLayout(classroom);
//    const { columns, seatsPerColumn, capacity } = classroom;

//    // Calculate seat numbers for proper numbering
//    let seatNumber = 1;
//    const numberedLayout = layout.map(row =>
//        row.map(col => ({
//            ...col,
//            seats: col.seats.map(() => ({
//                number: seatNumber++,
//                occupied: false
//            }))
//        }))
//    );

//    return (
//        <div className="classroom-layout-container">
//            <div className="classroom-header">
//                <div className="classroom-board">
//                    <FaChalkboardTeacher size={28} className="board-icon" />
//                    <span>Board</span>
//                </div>
//                <div className="classroom-info">
//                    <span className="badge bg-primary">{columns} Columns</span>
//                    <span className="badge bg-success">{seatsPerColumn} Seats per Column</span>
//                    <span className="badge bg-info">{capacity} Total Seats</span>
//                </div>
//                <div className="classroom-door">
//                    <FaDoorOpen size={20} className="door-icon" />
//                    <span>Door</span>
//                </div>
//            </div>

//            <div className="seating-area">
//                {numberedLayout.map((row, rowIndex) => (
//                    <div key={`row-${rowIndex}`} className="seat-row">
//                        {row.map((column, colIndex) => (
//                            <React.Fragment key={`col-${colIndex}`}>
//                                <div className="seat-column">
//                                    {column.seats.map((seat/*, seatIndex*/) => (
//                                        <motion.div
//                                            key={`seat-${seat.number}`}
//                                            className={`seat ${seat.occupied ? 'occupied' : 'available'}`}
//                                            whileHover={{ scale: 1.05 }}
//                                            whileTap={{ scale: 0.95 }}
//                                        >
//                                            <div className="seat-back"></div>
//                                            <div className="seat-bottom"></div>
//                                            <div className="seat-top">
//                                                <FaChair className="seat-icon" />
//                                                <span className="seat-number">{seat.number}</span>
//                                            </div>
//                                        </motion.div>
//                                    ))}
//                                </div>
//                                {colIndex < row.length - 1 && (
//                                    <div className="column-gap">
//                                        <div className="aisle-mark"></div>
//                                    </div>
//                                )}
//                            </React.Fragment>
//                        ))}
//                    </div>
//                ))}
//            </div>
//        </div>
//    );
//};
//    const getCapacityColor = (capacity) => {
//        if (capacity < 20) return 'info';
//        if (capacity < 50) return 'primary';
//        if (capacity < 100) return 'warning';
//        return 'danger';
//    };

//    const getLectureCountColor = (count) => {
//        if (count === 0) return 'secondary';
//        if (count < 3) return 'success';
//        if (count < 5) return 'warning';
//        return 'danger';
//    };

//    return (
//        <Container fluid className="classroom-management-container">
//            <ToastContainer position="top-right" autoClose={3000} />

//            <Row>
//                <Col lg={selectedClassroom ? 7 : 12}>
//                    <Card className="shadow-sm mb-4">
//                        <Card.Body>
//                            <div className="d-flex justify-content-between align-items-center mb-4">
//                                <h2 className="mb-0">
//                                    <FaChalkboardTeacher className="me-2 text-primary" />
//                                    Classroom Management
//                                </h2>
//                                <div>
//                                    <Button
//                                        variant="primary"
//                                        onClick={() => {
//                                            setFormData({
//                                                id: 0,
//                                                name: '',
//                                                capacity: 20,
//                                                columns: 2,
//                                                seatsPerColumn: 2
//                                            });
//                                            setShowModal(true);
//                                        }}
//                                        className="me-2"
//                                    >
//                                        <FaPlus className="me-1" /> Add Classroom
//                                    </Button>
//                                    <Button variant="outline-secondary" onClick={fetchClassrooms}>
//                                        <FaSyncAlt />
//                                    </Button>
//                                </div>
//                            </div>

//                            <div className="mb-3">
//                                <div className="input-group">
//                                    <span className="input-group-text">
//                                        <FaSearch />
//                                    </span>
//                                    <Form.Control
//                                        type="text"
//                                        placeholder="Search classrooms..."
//                                        value={searchTerm}
//                                        onChange={(e) => setSearchTerm(e.target.value)}
//                                    />
//                                </div>
//                            </div>

//                            {loading ? (
//                                <div className="text-center py-5">
//                                    <Spinner animation="border" variant="primary" />
//                                    <p className="mt-2">Loading classrooms...</p>
//                                </div>
//                            ) : filteredClassrooms.length === 0 ? (
//                                <Alert variant="info" className="text-center">
//                                    No classrooms found. Add a new classroom to get started.
//                                </Alert>
//                            ) : (
//                                <div className="table-responsive">
//                                    <table className="table table-hover">
//                                        <thead className="table-dark">
//                                            <tr>
//                                                <th>#</th>
//                                                <th>Name</th>
//                                                <th>Capacity</th>
//                                                <th>Layout</th>
//                                                <th>Lectures</th>
//                                                <th>Actions</th>
//                                            </tr>
//                                        </thead>
//                                        <tbody>
//                                            {filteredClassrooms.map((classroom, index) => (
//                                                <motion.tr
//                                                    key={classroom.id}
//                                                    initial={{ opacity: 0, y: 10 }}
//                                                    animate={{ opacity: 1, y: 0 }}
//                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
//                                                    className={selectedClassroom?.id === classroom.id ? 'table-active' : ''}
//                                                    onClick={() => setSelectedClassroom(classroom)}
//                                                >
//                                                    <td>{index + 1}</td>
//                                                    <td>
//                                                        <strong>{classroom.name}</strong>
//                                                    </td>
//                                                    <td>
//                                                        <Badge pill bg={getCapacityColor(classroom.capacity)}>
//                                                            {classroom.capacity} seats
//                                                        </Badge>
//                                                    </td>
//                                                    <td>
//                                                        {classroom.columns && classroom.seatsPerColumn ? (
//                                                            <small>{classroom.columns} cols × {classroom.seatsPerColumn} seats</small>
//                                                        ) : (
//                                                            <small className="text-muted">Not configured</small>
//                                                        )}
//                                                    </td>
//                                                    <td>
//                                                        <Badge pill bg={getLectureCountColor(classroom.lectureCount || 0)}>
//                                                            {classroom.lectureCount || 0} lectures
//                                                        </Badge>
//                                                    </td>
//                                                    <td>
//                                                        <div className="d-flex">
//                                                            <OverlayTrigger overlay={<Tooltip>View Lectures</Tooltip>}>
//                                                                <Button
//                                                                    variant="outline-info"
//                                                                    size="sm"
//                                                                    className="me-2"
//                                                                    onClick={(e) => {
//                                                                        e.stopPropagation();
//                                                                        handleShowLectures(classroom);
//                                                                    }}
//                                                                >
//                                                                    <FaList />
//                                                                </Button>
//                                                            </OverlayTrigger>
//                                                            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
//                                                                <Button
//                                                                    variant="outline-warning"
//                                                                    size="sm"
//                                                                    className="me-2"
//                                                                    onClick={(e) => {
//                                                                        e.stopPropagation();
//                                                                        setFormData({
//                                                                            id: classroom.id,
//                                                                            name: classroom.name,
//                                                                            capacity: classroom.capacity,
//                                                                            columns: classroom.columns || 2,
//                                                                            seatsPerColumn: classroom.seatsPerColumn || 2
//                                                                        });
//                                                                        setShowModal(true);
//                                                                    }}
//                                                                >
//                                                                    <FaEdit />
//                                                                </Button>
//                                                            </OverlayTrigger>
//                                                            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
//                                                                <Button
//                                                                    variant="outline-danger"
//                                                                    size="sm"
//                                                                    onClick={(e) => {
//                                                                        e.stopPropagation();
//                                                                        handleDelete(classroom.id);
//                                                                    }}
//                                                                >
//                                                                    <FaTrash />
//                                                                </Button>
//                                                            </OverlayTrigger>
//                                                        </div>
//                                                    </td>
//                                                </motion.tr>
//                                            ))}
//                                        </tbody>
//                                    </table>
//                                </div>
//                            )}
//                        </Card.Body>
//                    </Card>
//                </Col>

//                {selectedClassroom && (
//                    <Col lg={5}>
//                        <Card className="shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
//                            <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
//                                <h5 className="mb-0">
//                                    {selectedClassroom.name} - Layout Preview
//                                </h5>
//                                <Button
//                                    variant="link"
//                                    className="text-white p-0"
//                                    onClick={() => setSelectedClassroom(null)}
//                                >
//                                    <FaTimes />
//                                </Button>
//                            </Card.Header>
//                            <Card.Body>
//                                {renderClassroomLayout(selectedClassroom)}
//                                <div className="mt-3">
//                                    <h6>Layout Configuration</h6>
//                                    <div className="d-flex justify-content-between">
//                                        <div>
//                                            <strong>Columns:</strong> {selectedClassroom.columns || 2}
//                                        </div>
//                                        <div>
//                                            <strong>Seats per column:</strong> {selectedClassroom.seatsPerColumn || 2}
//                                        </div>
//                                        <div>
//                                            <strong>Total seats:</strong> {selectedClassroom.capacity}
//                                        </div>
//                                    </div>
//                                </div>
//                            </Card.Body>
//                        </Card>
//                    </Col>
//                )}
//            </Row>

//            {/* Add/Edit Classroom Modal */}
//            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        {formData.id === 0 ? 'Add New Classroom' : 'Edit Classroom'}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <Form onSubmit={handleSubmit}>
//                        <input type="hidden" name="id" value={formData.id} />
//                        <Row className="mb-3">
//                            <Col md={6}>
//                                <Form.Group controlId="formName">
//                                    <Form.Label>Classroom Name</Form.Label>
//                                    <Form.Control
//                                        type="text"
//                                        name="name"
//                                        value={formData.name}
//                                        onChange={handleInputChange}
//                                        required
//                                        placeholder="e.g., Classroom A-101"
//                                    />
//                                </Form.Group>
//                            </Col>
//                            <Col md={6}>
//                                <Form.Group controlId="formCapacity">
//                                    <Form.Label>Capacity</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="capacity"
//                                        min="1"
//                                        value={formData.capacity}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                        </Row>
//                        <Row className="mb-3">
//                            <Col md={6}>
//                                <Form.Group controlId="formColumns">
//                                    <Form.Label>Number of Columns</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="columns"
//                                        min="1"
//                                        max="10"
//                                        value={formData.columns}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                            <Col md={6}>
//                                <Form.Group controlId="formSeatsPerColumn">
//                                    <Form.Label>Seats Per Column</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="seatsPerColumn"
//                                        min="1"
//                                        max="10"
//                                        value={formData.seatsPerColumn}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                        </Row>
//                        <div className="mb-4">
//                            <h6>Layout Preview</h6>
//                            <div className="layout-preview-container">
//                                {generateClassroomLayout(formData).map((row, rowIndex) => (
//                                    <div key={`preview-row-${rowIndex}`} className="preview-row">
//                                        {row.map((col, colIndex) => (
//                                            <React.Fragment key={`preview-col-${colIndex}`}>
//                                                <div className="preview-column">
//                                                    {col.seats.map((seat, seatIndex) => (
//                                                        <div key={`preview-seat-${seatIndex}`} className="preview-seat">
//                                                            <FaChair size={12} />
//                                                        </div>
//                                                    ))}
//                                                </div>
//                                                {colIndex < row.length - 1 && <div className="preview-gap" />}
//                                            </React.Fragment>
//                                        ))}
//                                    </div>
//                                ))}
//                            </div>
//                            <div className="text-center mt-2">
//                                <small>
//                                    {formData.columns * formData.seatsPerColumn} seats per row ×{' '}
//                                    {Math.floor(formData.capacity / (formData.columns * formData.seatsPerColumn))} full rows
//                                    {formData.capacity % (formData.columns * formData.seatsPerColumn) > 0 && (
//                                        <> + 1 row with {formData.capacity % (formData.columns * formData.seatsPerColumn)} seats</>
//                                    )}
//                                </small>
//                            </div>
//                        </div>
//                        <div className="d-flex justify-content-end">
//                            <Button
//                                variant="outline-secondary"
//                                className="me-2"
//                                onClick={() => setShowModal(false)}
//                            >
//                                Cancel
//                            </Button>
//                            <Button variant="primary" type="submit">
//                                {formData.id === 0 ? 'Add Classroom' : 'Save Changes'}
//                            </Button>
//                        </div>
//                    </Form>
//                </Modal.Body>
//            </Modal>

//            {/* Lectures Modal */}
//            <Modal
//                show={showLectureModal}
//                onHide={() => setShowLectureModal(false)}
//                size="lg"
//                centered
//            >
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        Lectures in {selectedClassroom?.name}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    {lectures.length > 0 ? (
//                        <div className="table-responsive">
//                            <table className="table">
//                                <thead>
//                                    <tr>
//                                        <th>Code</th>
//                                        <th>Name</th>
//                                        <th>Language</th>
//                                        <th>Students</th>
//                                        <th>Instructor</th>
//                                    </tr>
//                                </thead>
//                                <tbody>
//                                    {lectures.map(lecture => (
//                                        <tr key={lecture.id}>
//                                            <td><strong>{lecture.lectureCode}</strong></td>
//                                            <td>{lecture.name}</td>
//                                            <td>{lecture.language}</td>
//                                            <td>{lecture.studentNumber}</td>
//                                            <td>{lecture.instructorName}</td>
//                                        </tr>
//                                    ))}
//                                </tbody>
//                            </table>
//                        </div>
//                    ) : (
//                        <Alert variant="info" className="text-center">
//                            No lectures assigned to this classroom.
//                        </Alert>
//                    )}
//                </Modal.Body>
//                <Modal.Footer>
//                    <Button
//                        variant="secondary"
//                        onClick={() => setShowLectureModal(false)}
//                    >
//                        Close
//                    </Button>
//                </Modal.Footer>
//            </Modal>
//        </Container>
//    );
//};

//export default ClassroomManagement;














//import React, { useState, useEffect } from 'react';
//import {
//    Card, Button, Modal, Form, Row, Col, Alert, Badge,
//    Spinner, OverlayTrigger, Tooltip, ToastContainer, Container
//} from 'react-bootstrap';
//import axios from 'axios';
//import {
//    FaChair, FaChalkboardTeacher, FaEye, FaEdit, FaTrash,
//    FaList, FaPlus, FaSearch, FaSyncAlt, FaDoorOpen, FaTimes
//} from 'react-icons/fa';
//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
//import { motion, AnimatePresence } from 'framer-motion';
//import '../CSS/ClassroomManagement.css';

//const ClassroomManagement = () => {
//    const [classrooms, setClassrooms] = useState([]);
//    const [filteredClassrooms, setFilteredClassrooms] = useState([]);
//    const [showModal, setShowModal] = useState(false);
//    const [showLayoutModal, setShowLayoutModal] = useState(false);
//    const [selectedClassroom, setSelectedClassroom] = useState(null);
//    const [lectures, setLectures] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [searchTerm, setSearchTerm] = useState('');

//    const [formData, setFormData] = useState({
//        id: 0,
//        name: '',
//        capacity: 20,
//        columns: 2,
//        seatsPerColumn: 2
//    });

//    useEffect(() => {
//        fetchClassrooms();
//    }, []);

//    useEffect(() => {
//        const results = classrooms.filter(classroom =>
//            classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//            classroom.capacity.toString().includes(searchTerm)
//        );
//        setFilteredClassrooms(results);
//    }, [searchTerm, classrooms]);

//    const fetchClassrooms = async () => {
//        try {
//            setLoading(true);
//            const response = await axios.get('/api/ClassroomManagement');
//            setClassrooms(response.data);
//            setFilteredClassrooms(response.data);
//        } catch (error) {
//            toast.error('Failed to fetch classrooms');
//            console.error(error);
//        } finally {
//            setLoading(false);
//        }
//    };

//    const fetchLecturesForClassroom = async (classroomId) => {
//        try {
//            const response = await axios.get(`/api/ClassroomManagement/${classroomId}/lectures`);
//            setLectures(response.data);
//        } catch (error) {
//            toast.error('Failed to fetch lectures');
//            console.error(error);
//        }
//    };

//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setFormData(prev => ({
//            ...prev,
//            [name]: ['id', 'capacity', 'columns', 'seatsPerColumn'].includes(name)
//                ? parseInt(value) || 0
//                : value
//        }));
//    };

//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            if (formData.id === 0) {
//                await axios.post('/api/ClassroomManagement', formData);
//                toast.success('Classroom added successfully');
//            } else {
//                await axios.put(`/api/ClassroomManagement/${formData.id}`, formData);
//                toast.success('Classroom updated successfully');
//            }
//            setShowModal(false);
//            fetchClassrooms();
//        } catch (error) {
//            toast.error('Operation failed');
//            console.error(error);
//        }
//    };

//    const handleDelete = async (id) => {
//        if (window.confirm('Are you sure you want to delete this classroom?')) {
//            try {
//                await axios.delete(`/api/ClassroomManagement/${id}`);
//                toast.success('Classroom deleted successfully');
//                fetchClassrooms();
//                setSelectedClassroom(null);
//                setLectures([]);
//            } catch (error) {
//                toast.error('Delete failed - classroom may have assigned lectures');
//                console.error(error);
//            }
//        }
//    };

//    const handleShowLectures = async (classroom) => {
//        setSelectedClassroom(classroom);
//        await fetchLecturesForClassroom(classroom.id);
//    };

//    const handleShowLayout = (classroom) => {
//        setSelectedClassroom(classroom);
//        setShowLayoutModal(true);
//    };

//    const generateClassroomLayout = (classroom) => {
//        const { capacity, columns = 2, seatsPerColumn = 2 } = classroom;
//        const seatsPerRow = columns * seatsPerColumn;
//        const fullRows = Math.floor(capacity / seatsPerRow);
//        const remainingSeats = capacity % seatsPerRow;

//        let layout = [];
//        let seatNumber = 1;

//        // Generate full rows
//        for (let row = 0; row < fullRows; row++) {
//            let rowSeats = [];
//            for (let col = 0; col < columns; col++) {
//                const columnSeats = [];
//                for (let seat = 0; seat < seatsPerColumn; seat++) {
//                    columnSeats.push({
//                        number: seatNumber++,
//                        occupied: false
//                    });
//                }
//                rowSeats.push({
//                    column: col,
//                    seats: columnSeats
//                });
//            }
//            layout.push(rowSeats);
//        }

//        // Generate remaining seats row if needed
//        if (remainingSeats > 0) {
//            let remainingColumns = Math.ceil(remainingSeats / seatsPerColumn);
//            let rowSeats = [];

//            for (let col = 0; col < remainingColumns; col++) {
//                const seatsInThisColumn = col === remainingColumns - 1
//                    ? remainingSeats % seatsPerColumn || seatsPerColumn
//                    : seatsPerColumn;

//                const columnSeats = [];
//                for (let seat = 0; seat < seatsInThisColumn; seat++) {
//                    columnSeats.push({
//                        number: seatNumber++,
//                        occupied: false
//                    });
//                }
//                rowSeats.push({
//                    column: col,
//                    seats: columnSeats
//                });
//            }
//            layout.push(rowSeats);
//        }

//        return layout;
//    };

//    const renderClassroomLayout = (classroom) => {
//        if (!classroom) return null;

//        const layout = generateClassroomLayout(classroom);
//        const { columns, seatsPerColumn, capacity } = classroom;

//        return (
//            <div className="classroom-layout-container">
//                <div className="classroom-header">
//                    <div className="classroom-board">
//                        <FaChalkboardTeacher size={28} className="board-icon" />
//                        <span>Board</span>
//                    </div>
//                    <div className="classroom-info">
//                        <span className="badge bg-primary">{columns} Columns</span>
//                        <span className="badge bg-success">{seatsPerColumn} Seats per Column</span>
//                        <span className="badge bg-info">{capacity} Total Seats</span>
//                    </div>
//                    <div className="classroom-door">
//                        <FaDoorOpen size={20} className="door-icon" />
//                        <span>Door</span>
//                    </div>
//                </div>

//                <div className="seating-area">
//                    {layout.map((row, rowIndex) => (
//                        <div key={`row-${rowIndex}`} className="seat-row">
//                            {row.map((column, colIndex) => (
//                                <React.Fragment key={`col-${colIndex}`}>
//                                    <div className="seat-column">
//                                        {column.seats.map((seat) => (
//                                            <motion.div
//                                                key={`seat-${seat.number}`}
//                                                className={`seat ${seat.occupied ? 'occupied' : 'available'}`}
//                                                whileHover={{ scale: 1.05 }}
//                                                whileTap={{ scale: 0.95 }}
//                                            >
//                                                <div className="seat-back"></div>
//                                                <div className="seat-bottom"></div>
//                                                <div className="seat-top">
//                                                    <FaChair className="seat-icon" />
//                                                    <span className="seat-number">{seat.number}</span>
//                                                </div>
//                                            </motion.div>
//                                        ))}
//                                    </div>
//                                    {colIndex < row.length - 1 && (
//                                        <div className="column-gap">
//                                            <div className="aisle-mark"></div>
//                                        </div>
//                                    )}
//                                </React.Fragment>
//                            ))}
//                        </div>
//                    ))}
//                </div>
//            </div>
//        );
//    };

//    const getCapacityColor = (capacity) => {
//        if (capacity < 20) return 'info';
//        if (capacity < 50) return 'primary';
//        if (capacity < 100) return 'warning';
//        return 'danger';
//    };

//    const getLectureCountColor = (count) => {
//        if (count === 0) return 'secondary';
//        if (count < 3) return 'success';
//        if (count < 5) return 'warning';
//        return 'danger';
//    };

//    return (
//        <Container fluid className="classroom-management-container">
//            <ToastContainer position="top-right" autoClose={3000} />

//            <Row>
//                <Col lg={selectedClassroom ? 7 : 12}>
//                    <Card className="shadow-sm mb-4">
//                        <Card.Body>
//                            <div className="d-flex justify-content-between align-items-center mb-4">
//                                <h2 className="mb-0">
//                                    <FaChalkboardTeacher className="me-2 text-primary" />
//                                    Classroom Management
//                                </h2>
//                                <div>
//                                    <Button
//                                        variant="primary"
//                                        onClick={() => {
//                                            setFormData({
//                                                id: 0,
//                                                name: '',
//                                                capacity: 20,
//                                                columns: 2,
//                                                seatsPerColumn: 2
//                                            });
//                                            setShowModal(true);
//                                        }}
//                                        className="me-2"
//                                    >
//                                        <FaPlus className="me-1" /> Add Classroom
//                                    </Button>
//                                    <Button variant="outline-secondary" onClick={fetchClassrooms}>
//                                        <FaSyncAlt />
//                                    </Button>
//                                </div>
//                            </div>

//                            <div className="mb-3">
//                                <div className="input-group">
//                                    <span className="input-group-text">
//                                        <FaSearch />
//                                    </span>
//                                    <Form.Control
//                                        type="text"
//                                        placeholder="Search classrooms..."
//                                        value={searchTerm}
//                                        onChange={(e) => setSearchTerm(e.target.value)}
//                                    />
//                                </div>
//                            </div>

//                            {loading ? (
//                                <div className="text-center py-5">
//                                    <Spinner animation="border" variant="primary" />
//                                    <p className="mt-2">Loading classrooms...</p>
//                                </div>
//                            ) : filteredClassrooms.length === 0 ? (
//                                <Alert variant="info" className="text-center">
//                                    No classrooms found. Add a new classroom to get started.
//                                </Alert>
//                            ) : (
//                                <div className="table-responsive">
//                                    <table className="table table-hover">
//                                        <thead className="table-dark">
//                                            <tr>
//                                                <th>#</th>
//                                                <th>Name</th>
//                                                <th>Capacity</th>
//                                                <th>Layout</th>
//                                                <th>Lectures</th>
//                                                <th>Actions</th>
//                                            </tr>
//                                        </thead>
//                                        <tbody>
//                                            {filteredClassrooms.map((classroom, index) => (
//                                                <motion.tr
//                                                    key={classroom.id}
//                                                    initial={{ opacity: 0, y: 10 }}
//                                                    animate={{ opacity: 1, y: 0 }}
//                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
//                                                    className={selectedClassroom?.id === classroom.id ? 'table-active' : ''}
//                                                    onClick={() => handleShowLectures(classroom)}
//                                                >
//                                                    <td>{index + 1}</td>
//                                                    <td>
//                                                        <strong>{classroom.name}</strong>
//                                                    </td>
//                                                    <td>
//                                                        <Badge pill bg={getCapacityColor(classroom.capacity)}>
//                                                            {classroom.capacity} seats
//                                                        </Badge>
//                                                    </td>
//                                                    <td>
//                                                        {classroom.columns && classroom.seatsPerColumn ? (
//                                                            <small>{classroom.columns} cols × {classroom.seatsPerColumn} seats</small>
//                                                        ) : (
//                                                            <small className="text-muted">Not configured</small>
//                                                        )}
//                                                    </td>
//                                                    <td>
//                                                        <Badge pill bg={getLectureCountColor(classroom.lectureCount || 0)}>
//                                                            {classroom.lectureCount || 0} lectures
//                                                        </Badge>
//                                                    </td>
//                                                    <td>
//                                                        <div className="d-flex">
//                                                            <OverlayTrigger overlay={<Tooltip>View Layout</Tooltip>}>
//                                                                <Button
//                                                                    variant="outline-info"
//                                                                    size="sm"
//                                                                    className="me-2"
//                                                                    onClick={(e) => {
//                                                                        e.stopPropagation();
//                                                                        handleShowLayout(classroom);
//                                                                    }}
//                                                                >
//                                                                    <FaEye />
//                                                                </Button>
//                                                            </OverlayTrigger>
//                                                            <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
//                                                                <Button
//                                                                    variant="outline-warning"
//                                                                    size="sm"
//                                                                    className="me-2"
//                                                                    onClick={(e) => {
//                                                                        e.stopPropagation();
//                                                                        setFormData({
//                                                                            id: classroom.id,
//                                                                            name: classroom.name,
//                                                                            capacity: classroom.capacity,
//                                                                            columns: classroom.columns || 2,
//                                                                            seatsPerColumn: classroom.seatsPerColumn || 2
//                                                                        });
//                                                                        setShowModal(true);
//                                                                    }}
//                                                                >
//                                                                    <FaEdit />
//                                                                </Button>
//                                                            </OverlayTrigger>
//                                                            <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
//                                                                <Button
//                                                                    variant="outline-danger"
//                                                                    size="sm"
//                                                                    onClick={(e) => {
//                                                                        e.stopPropagation();
//                                                                        handleDelete(classroom.id);
//                                                                    }}
//                                                                >
//                                                                    <FaTrash />
//                                                                </Button>
//                                                            </OverlayTrigger>
//                                                        </div>
//                                                    </td>
//                                                </motion.tr>
//                                            ))}
//                                        </tbody>
//                                    </table>
//                                </div>
//                            )}
//                        </Card.Body>
//                    </Card>
//                </Col>

//                {selectedClassroom && (
//                    <Col lg={5}>
//                        <Card className="shadow-sm mb-4 sticky-top" style={{ top: '20px' }}>
//                            <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
//                                <h5 className="mb-0">
//                                    Lectures in {selectedClassroom.name}
//                                </h5>
//                                <Button
//                                    variant="link"
//                                    className="text-white p-0"
//                                    onClick={() => {
//                                        setSelectedClassroom(null);
//                                        setLectures([]);
//                                    }}
//                                >
//                                    <FaTimes />
//                                </Button>
//                            </Card.Header>
//                            <Card.Body>
//                                {lectures.length > 0 ? (
//                                    <div className="table-responsive">
//                                        <table className="table table-sm">
//                                            <thead>
//                                                <tr>
//                                                    <th>Code</th>
//                                                    <th>Name</th>
//                                                    <th>Students</th>
//                                                    <th>Instructor</th>
//                                                </tr>
//                                            </thead>
//                                            <tbody>
//                                                {lectures.map(lecture => (
//                                                    <tr key={lecture.id}>
//                                                        <td><strong>{lecture.lectureCode}</strong></td>
//                                                        <td>{lecture.name}</td>
//                                                        <td>{lecture.studentNumber}</td>
//                                                        <td>{lecture.instructorName}</td>
//                                                    </tr>
//                                                ))}
//                                            </tbody>
//                                        </table>
//                                    </div>
//                                ) : (
//                                    <Alert variant="info" className="text-center mb-0">
//                                        No lectures assigned to this classroom.
//                                    </Alert>
//                                )}
//                            </Card.Body>
//                        </Card>
//                    </Col>
//                )}
//            </Row>

//            {/* Add/Edit Classroom Modal */}
//            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        {formData.id === 0 ? 'Add New Classroom' : 'Edit Classroom'}
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    <Form onSubmit={handleSubmit}>
//                        <input type="hidden" name="id" value={formData.id} />
//                        <Row className="mb-3">
//                            <Col md={6}>
//                                <Form.Group controlId="formName">
//                                    <Form.Label>Classroom Name</Form.Label>
//                                    <Form.Control
//                                        type="text"
//                                        name="name"
//                                        value={formData.name}
//                                        onChange={handleInputChange}
//                                        required
//                                        placeholder="e.g., Classroom A-101"
//                                    />
//                                </Form.Group>
//                            </Col>
//                            <Col md={6}>
//                                <Form.Group controlId="formCapacity">
//                                    <Form.Label>Capacity</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="capacity"
//                                        min="1"
//                                        value={formData.capacity}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                        </Row>
//                        <Row className="mb-3">
//                            <Col md={6}>
//                                <Form.Group controlId="formColumns">
//                                    <Form.Label>Number of Columns</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="columns"
//                                        min="1"
//                                        max="10"
//                                        value={formData.columns}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                            <Col md={6}>
//                                <Form.Group controlId="formSeatsPerColumn">
//                                    <Form.Label>Seats Per Column</Form.Label>
//                                    <Form.Control
//                                        type="number"
//                                        name="seatsPerColumn"
//                                        min="1"
//                                        max="10"
//                                        value={formData.seatsPerColumn}
//                                        onChange={handleInputChange}
//                                        required
//                                    />
//                                </Form.Group>
//                            </Col>
//                        </Row>
//                        <div className="mb-4">
//                            <h6>Layout Preview</h6>
//                            <div className="layout-preview-container">
//                                {generateClassroomLayout(formData).map((row, rowIndex) => (
//                                    <div key={`preview-row-${rowIndex}`} className="preview-row">
//                                        {row.map((col, colIndex) => (
//                                            <React.Fragment key={`preview-col-${colIndex}`}>
//                                                <div className="preview-column">
//                                                    {col.seats.map((seat) => (
//                                                        <div key={`preview-seat-${seat.number}`} className="preview-seat">
//                                                            <FaChair size={12} />
//                                                            <span className="preview-seat-number">{seat.number}</span>
//                                                        </div>
//                                                    ))}
//                                                </div>
//                                                {colIndex < row.length - 1 && <div className="preview-gap" />}
//                                            </React.Fragment>
//                                        ))}
//                                    </div>
//                                ))}
//                            </div>
//                            <div className="text-center mt-2">
//                                <small>
//                                    {formData.columns * formData.seatsPerColumn} seats per row ×{' '}
//                                    {Math.floor(formData.capacity / (formData.columns * formData.seatsPerColumn))} full rows
//                                    {formData.capacity % (formData.columns * formData.seatsPerColumn) > 0 && (
//                                        <> + 1 row with {formData.capacity % (formData.columns * formData.seatsPerColumn)} seats</>
//                                    )}
//                                </small>
//                            </div>
//                        </div>
//                        <div className="d-flex justify-content-end">
//                            <Button
//                                variant="outline-secondary"
//                                className="me-2"
//                                onClick={() => setShowModal(false)}
//                            >
//                                Cancel
//                            </Button>
//                            <Button variant="primary" type="submit">
//                                {formData.id === 0 ? 'Add Classroom' : 'Save Changes'}
//                            </Button>
//                        </div>
//                    </Form>
//                </Modal.Body>
//            </Modal>

//            {/* Classroom Layout Modal */}
//            <Modal
//                show={showLayoutModal}
//                onHide={() => setShowLayoutModal(false)}
//                size="xl"
//                centered
//                fullscreen="lg-down"
//            >
//                <Modal.Header closeButton className="bg-dark text-white">
//                    <Modal.Title>
//                        {selectedClassroom?.name} - Classroom Layout
//                    </Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    {selectedClassroom && renderClassroomLayout(selectedClassroom)}
//                </Modal.Body>
//            </Modal>
//        </Container>
//    );
//};

//export default ClassroomManagement;



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
    );
};

export default ClassroomManagement;