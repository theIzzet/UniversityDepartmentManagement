
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { Container, Row, Col, Table, Button, Card, Form } from 'react-bootstrap';
import '../CSS/LectureList.css';

const LectureList = () => {
    const [lectures, setLectures] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [form, setForm] = useState({
        id: 0,
        name: '',
        lectureCode: '',
        language: '',
        studentNumber: '',
        classroomId: '',
        instructorId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [lecturesRes, classroomsRes, instructorsRes] = await Promise.all([
                axios.get('/api/lecture'),
                axios.get('/api/ClassroomManagement'),
                axios.get('/api/UserManagement/instructors')
            ]);
            setLectures(lecturesRes.data);
            setClassrooms(classroomsRes.data);
            setInstructors(instructorsRes.data);
            setLoading(false);
        } catch /*(error) */{
            setError('Veriler yüklenirken hata oluþtu');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu dersi silmek istediðinize emin misiniz?')) {
            try {
                await axios.delete(`/api/lecture/${id}`);
                fetchData();
            } catch (error) {
                setError("Silinemedi: " + (error.response?.data || "Hata"));
            }
        }
    };

    const handleEdit = (lecture) => {
        setForm({
            id: lecture.id,
            name: lecture.name,
            lectureCode: lecture.lectureCode,
            language: lecture.language,
            studentNumber: lecture.studentNumber,
            classroomId: lecture.classroomId,
            instructorId: lecture.instructorId
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/lecture/${form.id}`, form);
            } else {
                await axios.post('/api/lecture', form);
            }
            setForm({
                id: 0,
                name: '',
                lectureCode: '',
                language: '',
                studentNumber: '',
                classroomId: '',
                instructorId: ''
            });
            setIsEditing(false);
            fetchData();
        } catch (error) {
            setError('Hata oluþtu: ' + (error.response?.data || "Hatalý veri"));
        }
    };

    const handleCancel = () => {
        setForm({
            id: 0,
            name: '',
            lectureCode: '',
            language: '',
            studentNumber: '',
            classroomId: '',
            instructorId: ''
        });
        setIsEditing(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="loading-spinner">Yükleniyor...</div>;

    return (
        <>
            <Navbar />
            <Container fluid className="lecture-management-container">
                <Row>
                    <Col lg={9} className="lecture-list-column" style={{ flex: '0 0 72%' }}>
                        <div className="lecture-list-header">
                            <h2>Ders Listesi</h2>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="lecture-table-container">
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        {/*<th>ID</th>*/}
                                        <th>Title</th>
                                        <th>Lecture Code</th>
                                        <th>Language</th>
                                        <th>StudentNumber</th>
                                        <th>Classroom</th>
                                        <th>Instructor</th>
                                        <th>Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lectures.map((lecture) => (
                                        <tr key={lecture.id}>
                                            {/*<td>{lecture.id}</td>*/}
                                            <td>{lecture.name}</td>
                                            <td>{lecture.lectureCode}</td>
                                            <td>{lecture.language}</td>
                                            <td>{lecture.studentNumber }</td>
                                            <td>
                                                {classrooms.find(c => c.id === lecture.classroomId)?.name || 'Belirtilmemiþ'}
                                            </td>
                                            <td>{lecture.instructorName}</td>
                                            <td>
                                                <Button variant="primary" size="sm" onClick={() => handleEdit(lecture)} className="me-2">
                                                    Edit
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDelete(lecture.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col lg={3} className="lecture-form-column" style={{ flex: '0 0 28%' }}>
                        <Card className="form-card">
                            <Card.Header className="form-card-header">
                                <h3>{isEditing ? 'Dersi Düzenle' : 'Yeni Ders Ekle'}</h3>
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Lecture Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Lecture Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="lectureCode"
                                            value={form.lectureCode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Language</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="language"
                                            value={form.language}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Student Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="studentNumber"
                                            value={form.studentNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Classroom</Form.Label>
                                        <Form.Select
                                            name="classroomId"
                                            value={form.classroomId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Classroom</option>
                                            {classrooms.map(classroom => (
                                                <option key={classroom.id} value={classroom.id}>
                                                    {classroom.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Instructor</Form.Label>
                                        <Form.Select
                                            name="instructorId"
                                            value={form.instructorId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Instructor</option>
                                            {instructors.map(instructor => (
                                                <option key={instructor.id} value={instructor.id}>
                                                    {instructor.fullName} (Sicil No: {instructor.sicilNo})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <div className="form-buttons">
                                        <Button variant={isEditing ? 'warning' : 'success'} type="submit">
                                            {isEditing ? 'Update' : 'Save'}
                                        </Button>
                                        {isEditing && (
                                            <Button variant="danger" onClick={handleCancel} className="ms-2">
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default LectureList;









