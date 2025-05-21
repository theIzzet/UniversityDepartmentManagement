















import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Spinner, Accordion } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO, /*isSameDay*/ } from 'date-fns';
import { FaCalendarAlt, FaChalkboardTeacher, FaUserTie, FaBook, FaBuilding, FaPlus, FaEdit, FaTrash, FaSearch, FaChevronDown, FaChevronUp, FaRegClock, FaUniversity, FaUserGraduate, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import Navbar from './Navbar';
import '../CSS/ExamManagement.css';
import { useAuth } from '../Contexts/AuthContext';
const ExamProgramManagement = () => {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [filter, /*setFilter*/] = useState({
        dateFrom: null,
        dateTo: null,
        classroom: '',
        supervisor: ''
    });
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState('');
    const [activeCommentSection, setActiveCommentSection] = useState(null);
    // Form state
    const [formData, setFormData] = useState({
        id: 0,
        lectureId: '',
        classroomId: '',
        supervisorId: '',
        examDate: new Date(),
        startTime: '09:00',
        endTime: '11:00',
        grade: 1,
        semester: 'Fall'
    });

    // Dropdown data
    const [lectures, setLectures] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [supervisors, setSupervisors] = useState([]);

    // Fetch data
    useEffect(() => {
        fetchData();
        fetchDropdownData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let url = '/api/exammanagement';
            const queryParams = [];

            if (filter.dateFrom) {
                queryParams.push(`dateFrom=${filter.dateFrom.toISOString()}`);
            }
            if (filter.dateTo) {
                queryParams.push(`dateTo=${filter.dateTo.toISOString()}`);
            }
            if (filter.classroom) {
                queryParams.push(`classroom=${filter.classroom}`);
            }
            if (filter.supervisor) {
                queryParams.push(`supervisor=${filter.supervisor}`);
            }

            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch exams');
            const data = await response.json();
            setExams(data);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load exams: ' + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            // Fetch lectures
            const lecturesResponse = await fetch('/api/exammanagement/lectures');
            if (!lecturesResponse.ok) throw new Error('Failed to fetch lectures');
            const lecturesData = await lecturesResponse.json();
            setLectures(lecturesData);

            // Fetch classrooms
            const classroomsResponse = await fetch('/api/exammanagement/classrooms');
            if (!classroomsResponse.ok) throw new Error('Failed to fetch classrooms');
            const classroomsData = await classroomsResponse.json();
            setClassrooms(classroomsData);

            // Fetch supervisors
            const supervisorsResponse = await fetch('/api/exammanagement/supervisors');
            if (!supervisorsResponse.ok) throw new Error('Failed to fetch supervisors');
            const supervisorsData = await supervisorsResponse.json();
            setSupervisors(supervisorsData);
        } catch (err) {
            toast.error('Failed to load dropdown data: ' + err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            examDate: date
        }));
    };

    const handleStartTimeChange = (time) => {
        setFormData(prev => ({
            ...prev,
            startTime: time || '09:00'
        }));
    };

    const handleEndTimeChange = (time) => {
        setFormData(prev => ({
            ...prev,
            endTime: time || '11:00'
        }));
    };

    const handleShowModal = (exam = null) => {
        if (exam) {
            const examDate = new Date(exam.examDate);
            setFormData({
                id: exam.id,
                lectureId: exam.lectureId,
                classroomId: exam.classroomId,
                supervisorId: exam.supervisorId,
                examDate: examDate,
                startTime: exam.startTime,
                endTime: exam.endTime,
                grade: exam.grade,
                semester: exam.semester
            });
        } else {
            setFormData({
                id: 0,
                lectureId: '',
                classroomId: '',
                supervisorId: '',
                examDate: new Date(),
                startTime: '09:00',
                endTime: '11:00',
                grade: 1,
                semester: 'Fall'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const method = formData.id ? 'PUT' : 'POST';
            const url = formData.id
                ? `/api/exammanagement/${formData.id}`
                : '/api/exammanagement';

            // Format the data properly
            const formattedData = {
                ...formData,
                examDate: formData.examDate.toISOString(),
                // Time values are already strings in HH:mm format
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Failed to save exam');
            }

            toast.success(`Exam ${formData.id ? 'updated' : 'created'} successfully!`);
            fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
            toast.error('Error: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                const response = await fetch(`/api/exammanagement/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Failed to delete exam');

                toast.success('Exam deleted successfully!');
                fetchData();
            } catch (err) {
                toast.error('Error: ' + err.message);
            }
        }
    };
    const fetchComments = async (examId) => {
        try {
            const response = await fetch(`/api/exammanagement/${examId}/comments`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            setComments(prev => ({ ...prev, [examId]: data }));
        } catch (err) {
            toast.error('Failed to load comments: ' + err.message);
        }
    };

    // Yorum ekleme fonksiyonu
    const handleAddComment = async (examId) => {
        if (!newComment.trim()) {
            toast.warning('Please enter a comment');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You need to login first');
                return;
            }

            // Kullanıcının Instructor rolüne sahip olup olmadığını kontrol et
            if (!user || user.role !== 'Instructor') {
                toast.error('Only instructors can add comments');
                return;
            }

            const response = await fetch(`/api/exammanagement/${examId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error('Session expired, please login again');
                    return;
                }
                throw new Error('Failed to add comment');
            }

            toast.success('Comment added successfully!');
            setNewComment('');
            fetchComments(examId);
        } catch (err) {
            toast.error('Error: ' + err.message);
        }
    };

 

    const getSelectedLecture = () => {
        return lectures.find(l => l.id === parseInt(formData.lectureId));
    };

    const getSelectedClassroom = () => {
        return classrooms.find(c => c.id === parseInt(formData.classroomId));
    };
    const groupExamsByDate = () => {
        const grouped = {};

        exams.forEach(exam => {
            const dateKey = format(parseISO(exam.examDate), 'yyyy-MM-dd');
            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    date: exam.examDate,
                    formattedDate: format(parseISO(exam.examDate), 'dd MMMM yyyy (EEEE)'),
                    exams: []
                };
            }
            grouped[dateKey].exams.push(exam);
        });

        return Object.values(grouped).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    };

    const groupedExams = groupExamsByDate();
    return (
        <>
            <Navbar />
            <div className="exam-page-container">
                <ToastContainer position="top-right" autoClose={5000} />

                {/* Header Card with Animated Gradient */}
                <Card className="glass-card exam-header animated-gradient">
                    <Row className="align-items-center">
                        <Col>
                            <h2 className="page-title">
                                <FaCalendarAlt className="me-2" />
                                Exam Schedule Management
                            </h2>
                            <p className="page-subtitle">Organize and manage all department examinations</p>
                        </Col>
                        <Col className="text-end">
                            <Button variant="light" onClick={() => handleShowModal()} className="add-exam-btn">
                                <FaPlus className="me-1" />
                                Schedule New Exam
                            </Button>
                        </Col>
                    </Row>
                </Card>

                {/* Filter Section - Same as before */}

                {/* Exams Timeline View */}
                {isLoading ? (
                    <Card className="glass-card loading-container">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Loading exam schedule...</p>
                    </Card>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : exams.length === 0 ? (
                    <Card className="glass-card empty-state">
                        <FaCalendarAlt size={48} className="empty-state-icon mb-3" />
                        <h4>No Exams Scheduled</h4>
                        <p className="text-muted">The exam schedule is currently empty. Add exams to begin.</p>
                        <Button variant="primary" onClick={() => handleShowModal()} className="mt-3 pulse">
                            <FaPlus className="me-1" />
                            Schedule First Exam
                        </Button>
                    </Card>
                ) : (
                    <div className="timeline-container">
                        {groupedExams.map((day, dayIndex) => (
                            <Card key={dayIndex} className="glass-card day-card">
                                <Card.Header className="day-header">
                                    <h3 className="day-title">
                                        {day.formattedDate}
                                        <Badge pill bg="info" className="ms-2">
                                            {day.exams.length} {day.exams.length === 1 ? 'Exam' : 'Exams'}
                                        </Badge>
                                    </h3>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Accordion defaultActiveKey="0" flush>
                                        {day.exams.map((exam, examIndex) => (
                                            <Accordion.Item key={examIndex} eventKey={examIndex.toString()} className="exam-item">
                                                <Accordion.Header className="exam-header">
                                                    <Row className="w-100 align-items-center">
                                                        <Col xs={12} md={4}>
                                                            <div className="d-flex align-items-center">
                                                                <FaRegClock className="me-2 text-primary" />
                                                                <strong>{exam.startTime} - {exam.endTime}</strong>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} md={4}>
                                                            <div className="d-flex align-items-center">
                                                                <FaBook className="me-2 text-primary" />
                                                                <span className="text-truncate">{exam.lectureName}</span>
                                                            </div>
                                                        </Col>
                                                        <Col xs={12} md={4}>
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                <Badge bg={exam.grade === 1 ? 'primary' : exam.grade === 2 ? 'success' : exam.grade === 3 ? 'warning' : 'danger'} className="me-2">
                                                                    Grade {exam.grade}
                                                                </Badge>
                                                                <div className="action-buttons">
                                                                    <Button
                                                                        variant="outline-primary"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleShowModal(exam);
                                                                        }}
                                                                        className="me-1"
                                                                    >
                                                                        <FaEdit />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDelete(exam.id);
                                                                        }}
                                                                    >
                                                                        <FaTrash />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Accordion.Header>
                                                <Accordion.Body className="exam-details">
                                                    <Row>
                                                        <Col md={4}>
                                                            <div className="detail-item">
                                                                <FaUniversity className="me-2" />
                                                                <strong>Classroom:</strong> {exam.classroomName}
                                                            </div>
                                                            <div className="detail-item">
                                                                <FaUserTie className="me-2" />
                                                                <strong>Supervisor:</strong> {exam.supervisorName}
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="detail-item">
                                                                <FaUserGraduate className="me-2" />
                                                                <strong>Students:</strong> {exam.studentCount}
                                                            </div>
                                                            <div className="detail-item">
                                                                <FaCalendarAlt className="me-2" />
                                                                <strong>Semester:</strong> {exam.semester}
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="detail-item">
                                                                <strong>Code:</strong> {exam.lectureCode}
                                                            </div>
                                                            <div className="detail-item">
                                                                <strong>Capacity:</strong>
                                                                <Badge
                                                                    bg={exam.studentCount > exam.classroomCapacity ? 'danger' : 'success'}
                                                                    className="ms-2"
                                                                >
                                                                    {exam.studentCount}/{exam.classroomCapacity}
                                                                </Badge>
                                                            </div>
                                                        </Col>












                                                        <Col md={4}>
                                                            <div className="detail-item">
                                                                <strong>Code:</strong> {exam.lectureCode}
                                                            </div>
                                                            <div className="detail-item">
                                                                <strong>Capacity:</strong>
                                                                <Badge
                                                                    bg={exam.studentCount > exam.classroomCapacity ? 'danger' : 'success'}
                                                                    className="ms-2"
                                                                >
                                                                    {exam.studentCount}/{exam.classroomCapacity}
                                                                </Badge>
                                                            </div>

                                                            {/* Yorumlar bölümü */}
                                                            <div className="mt-3">
                                                                <Button
                                                                    variant="link"
                                                                    className="p-0 text-decoration-none"
                                                                    onClick={() => {
                                                                        setActiveCommentSection(activeCommentSection === exam.id ? null : exam.id);
                                                                        if (activeCommentSection !== exam.id && !comments[exam.id]) {
                                                                            fetchComments(exam.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    {activeCommentSection === exam.id ? (
                                                                        <FaChevronUp className="me-1" />
                                                                    ) : (
                                                                        <FaChevronDown className="me-1" />
                                                                    )}
                                                                    Comments ({comments[exam.id]?.length || 0})
                                                                </Button>

                                                                {activeCommentSection === exam.id && (
                                                                    <div className="mt-2 comment-section">
                                                                        {/* Yorum listesi */}
                                                                        <div className="comment-list mb-3">
                                                                            {comments[exam.id]?.length > 0 ? (
                                                                                comments[exam.id].map(comment => (
                                                                                    <div key={comment.id} className="comment-item mb-2 p-2 bg-light rounded">
                                                                                        <div className="d-flex justify-content-between">
                                                                                            <strong>{comment.instructorName}</strong>
                                                                                            <small className="text-muted">
                                                                                                {format(parseISO(comment.createdAt), 'dd MMM yyyy HH:mm')}
                                                                                            </small>
                                                                                        </div>
                                                                                        <p className="mb-0 mt-1">{comment.content}</p>
                                                                                    </div>
                                                                                ))
                                                                            ) : (
                                                                                <p className="text-muted">No comments yet</p>
                                                                            )}
                                                                        </div>

                                                                        {user && user.role === 'Instructor' && (
                                                                            <Form.Group>
                                                                                <Form.Control
                                                                                    as="textarea"
                                                                                    rows={2}
                                                                                    placeholder="Add a comment..."
                                                                                    value={newComment}
                                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                                    className="mb-2"
                                                                                />
                                                                                <Button
                                                                                    variant="primary"
                                                                                    size="sm"
                                                                                    onClick={() => handleAddComment(exam.id)}
                                                                                >
                                                                                    Post Comment
                                                                                </Button>
                                                                            </Form.Group>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Add/Edit Exam Modal */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                    <Modal.Header closeButton className="modal-header">
                        <Modal.Title>
                            {formData.id ? 'Edit Exam' : 'Add New Exam'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            {error && (
                                <Alert variant="danger" className="d-flex align-items-center">
                                    <FaExclamationTriangle className="me-2" />
                                    {error}
                                </Alert>
                            )}

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaBook className="me-2" />
                                            Lecture
                                        </Form.Label>
                                        <Form.Select
                                            name="lectureId"
                                            value={formData.lectureId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Lecture</option>
                                            {lectures.map(lecture => (
                                                <option key={lecture.id} value={lecture.id}>
                                                    {lecture.lectureCode} - {lecture.name} ({lecture.studentNumber} students)
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaBuilding className="me-2" />
                                            Classroom
                                        </Form.Label>
                                        <Form.Select
                                            name="classroomId"
                                            value={formData.classroomId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Classroom</option>
                                            {classrooms.map(classroom => {
                                                const lecture = getSelectedLecture();
                                                const isCapacityOk = lecture ? lecture.studentNumber <= classroom.capacity : true;

                                                return (
                                                    <option
                                                        key={classroom.id}
                                                        value={classroom.id}
                                                        disabled={!isCapacityOk}
                                                    >
                                                        {classroom.name} (Capacity: {classroom.capacity})
                                                        {!isCapacityOk && ' - Capacity exceeded'}
                                                    </option>
                                                );
                                            })}
                                        </Form.Select>
                                        {getSelectedLecture() && getSelectedClassroom() && (
                                            <div className="mt-2">
                                                {getSelectedLecture().studentNumber > getSelectedClassroom().capacity ? (
                                                    <Alert variant="danger" className="py-1 px-2 mb-0">
                                                        Classroom capacity ({getSelectedClassroom().capacity}) is less than student number ({getSelectedLecture().studentNumber})
                                                    </Alert>
                                                ) : (
                                                    <Alert variant="success" className="py-1 px-2 mb-0">
                                                        Classroom capacity is sufficient ({getSelectedClassroom().capacity} ≥ {getSelectedLecture().studentNumber})
                                                    </Alert>
                                                )}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaUserTie className="me-2" />
                                            Supervisor
                                        </Form.Label>
                                        <Form.Select
                                            name="supervisorId"
                                            value={formData.supervisorId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Supervisor</option>
                                            {supervisors.map(supervisor => (
                                                <option key={supervisor.id} value={supervisor.id}>
                                                    {supervisor.name} ({supervisor.sicilNo})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaCalendarAlt className="me-2" />
                                            Exam Date
                                        </Form.Label>
                                        <DatePicker
                                            selected={formData.examDate}
                                            onChange={handleDateChange}
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            minDate={new Date()}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Time</Form.Label>
                                        <div className="time-picker-container">
                                            <div className="time-picker-wrapper">
                                                <TimePicker
                                                    onChange={handleStartTimeChange}
                                                    value={formData.startTime}
                                                    className="form-control"
                                                    disableClock={true}
                                                    clearIcon={null}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Time</Form.Label>
                                        <div className="time-picker-container">
                                            <div className="time-picker-wrapper">
                                                <TimePicker
                                                    onChange={handleEndTimeChange}
                                                    value={formData.endTime}
                                                    className="form-control"
                                                    disableClock={true}
                                                    clearIcon={null}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Grade</Form.Label>
                                        <Form.Select
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="1">Grade 1</option>
                                            <option value="2">Grade 2</option>
                                            <option value="3">Grade 3</option>
                                            <option value="4">Grade 4</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Semester</Form.Label>
                                        <Form.Select
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="Fall">Fall</option>
                                            <option value="Spring">Spring</option>
                                            <option value="Summer">Summer</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        <span className="ms-2">Saving...</span>
                                    </>
                                ) : (
                                    'Save Exam'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </div>
        </>
    );
};

export default ExamProgramManagement;








