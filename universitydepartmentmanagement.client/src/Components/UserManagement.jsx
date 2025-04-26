//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { useAuth } from '../Contexts/AuthContext';
//import { useNavigate } from 'react-router-dom';
//import {
//    Container,
//    Table,
//    Button,
//    Modal,
//    Form,
//    Alert,
//    Spinner,
//    Badge,
//    InputGroup,
//    FloatingLabel,
//    Toast
//} from 'react-bootstrap';
//import { PencilSquare, Trash, PlusCircle, Search } from 'react-bootstrap-icons';

//const UserManagement = () => {
//    const { user } = useAuth();
//    const navigate = useNavigate();
//    const [users, setUsers] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState('');
//    const [showCreateModal, setShowCreateModal] = useState(false);
//    const [showEditModal, setShowEditModal] = useState(false);
//    const [showDeleteModal, setShowDeleteModal] = useState(false);
//    const [selectedUser, setSelectedUser] = useState(null);
//    const [searchTerm, setSearchTerm] = useState('');
//    const [showToast, setShowToast] = useState(false);
//    const [toastMessage, setToastMessage] = useState('');

//    // Form states
//    const [createForm, setCreateForm] = useState({
//        name: '',
//        surName: '',
//        email: '',
//        password: '',
//        sicilNo: '',
//        role: 'Instructor'
//    });

//    const [editForm, setEditForm] = useState({
//        name: '',
//        surName: '',
//        email: '',
//        sicilNo: ''
//    });

//    const roles = ['Instructor', 'Department Secretary', 'Chair'];

//    useEffect(() => {
//        if (!user || (user.role !== 'Department Secretary' && user.role !== 'Chair')) {
//            navigate('/main');
//            return;
//        }

//        fetchUsers();
//    }, [user, navigate]);

//    const fetchUsers = async () => {
//        try {
//            setLoading(true);
//            const response = await axios.get('/api/UserManagement');
//            setUsers(response.data);
//            setLoading(false);
//        } catch (err) {
//            setError('Failed to fetch users');
//            setLoading(false);
//            console.error(err);
//        }
//    };

//    const handleCreateSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            await axios.post('/api/UserManagement/create', createForm);
//            setShowCreateModal(false);
//            setCreateForm({
//                name: '',
//                surName: '',
//                email: '',
//                password: '',
//                sicilNo: '',
//                role: 'Instructor'
//            });
//            fetchUsers();
//            showSuccessToast('User created successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to create user');
//            console.error(err);
//        }
//    };

//    const handleEditSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            await axios.put(`/api/UserManagement/update/${selectedUser.id}`, editForm);
//            setShowEditModal(false);
//            fetchUsers();
//            showSuccessToast('User updated successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to update user');
//            console.error(err);
//        }
//    };

//    const handleDelete = async () => {
//        try {
//            await axios.delete(`/api/UserManagement/delete/${selectedUser.id}`);
//            setShowDeleteModal(false);
//            fetchUsers();
//            showSuccessToast('User deleted successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to delete user');
//            console.error(err);
//        }
//    };

//    const showSuccessToast = (message) => {
//        setToastMessage(message);
//        setShowToast(true);
//        setTimeout(() => setShowToast(false), 3000);
//    };

//    const filteredUsers = users.filter(user =>
//        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        user.surName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        user.sicilNo.toString().includes(searchTerm)
//    );

//    const getRoleBadge = (role) => {
//        const variant = role === 'Chair' ? 'danger' :
//            role === 'Department Secretary' ? 'warning' : 'primary';
//        return <Badge bg={variant} className="text-capitalize">{role}</Badge>;
//    };

//    return (
//        <Container className="py-5 mt-4">
//            <div className="d-flex justify-content-between align-items-center mb-4">
//                <h2 className="mb-0">
//                    <i className="bi bi-people-fill text-primary me-2"></i>
//                    User Management
//                </h2>
//                <Button
//                    variant="primary"
//                    onClick={() => setShowCreateModal(true)}
//                    className="d-flex align-items-center"
//                >
//                    <PlusCircle size={18} className="me-2" />
//                    Add New User
//                </Button>
//            </div>

//            <InputGroup className="mb-4">
//                <InputGroup.Text>
//                    <Search />
//                </InputGroup.Text>
//                <Form.Control
//                    placeholder="Search users..."
//                    value={searchTerm}
//                    onChange={(e) => setSearchTerm(e.target.value)}
//                />
//            </InputGroup>

//            {error && <Alert variant="danger">{error}</Alert>}

//            {loading ? (
//                <div className="text-center py-5">
//                    <Spinner animation="border" variant="primary" />
//                    <p className="mt-2">Loading users...</p>
//                </div>
//            ) : (
//                <div className="table-responsive">
//                    <Table striped bordered hover className="shadow-sm">
//                        <thead className="bg-dark text-white">
//                            <tr>
//                                <th>#</th>
//                                <th>Name</th>
//                                <th>Email</th>
//                                <th>Sicil No</th>
//                                <th>Roles</th>
//                                <th>Actions</th>
//                            </tr>
//                        </thead>
//                        <tbody>
//                            {filteredUsers.map((user, index) => (
//                                <tr key={user.id}>
//                                    <td>{index + 1}</td>
//                                    <td>{user.name} {user.surName}</td>
//                                    <td>{user.email}</td>
//                                    <td>{user.sicilNo}</td>
//                                    <td>
//                                        {user.roles.map(role => (
//                                            <React.Fragment key={role}>
//                                                {getRoleBadge(role)}{' '}
//                                            </React.Fragment>
//                                        ))}
//                                    </td>
//                                    <td>
//                                        <Button
//                                            variant="outline-primary"
//                                            size="sm"
//                                            className="me-2"
//                                            onClick={() => {
//                                                setSelectedUser(user);
//                                                setEditForm({
//                                                    name: user.name,
//                                                    surName: user.surName,
//                                                    email: user.email,
//                                                    sicilNo: user.sicilNo
//                                                });
//                                                setShowEditModal(true);
//                                            }}
//                                        >
//                                            <PencilSquare size={16} />
//                                        </Button>
//                                        <Button
//                                            variant="outline-danger"
//                                            size="sm"
//                                            onClick={() => {
//                                                setSelectedUser(user);
//                                                setShowDeleteModal(true);
//                                            }}
//                                        >
//                                            <Trash size={16} />
//                                        </Button>
//                                    </td>
//                                </tr>
//                            ))}
//                        </tbody>
//                    </Table>
//                </div>
//            )}

//            {/* Create User Modal */}
//            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
//                <Modal.Header closeButton className="bg-primary text-white">
//                    <Modal.Title>Create New User</Modal.Title>
//                </Modal.Header>
//                <Form onSubmit={handleCreateSubmit}>
//                    <Modal.Body>
//                        <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Name"
//                                value={createForm.name}
//                                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingSurName" label="Surname" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Surname"
//                                value={createForm.surName}
//                                onChange={(e) => setCreateForm({ ...createForm, surName: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
//                            <Form.Control
//                                type="email"
//                                placeholder="Email"
//                                value={createForm.email}
//                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
//                            <Form.Control
//                                type="password"
//                                placeholder="Password"
//                                value={createForm.password}
//                                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
//                                required
//                                minLength="6"
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingSicilNo" label="Sicil No" className="mb-3">
//                            <Form.Control
//                                type="number"
//                                placeholder="Sicil No"
//                                value={createForm.sicilNo}
//                                onChange={(e) => setCreateForm({ ...createForm, sicilNo: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <Form.Group className="mb-3">
//                            <Form.Label>Role</Form.Label>
//                            <Form.Select
//                                value={createForm.role}
//                                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
//                                required
//                            >
//                                {roles.map(role => (
//                                    <option key={role} value={role}>{role}</option>
//                                ))}
//                            </Form.Select>
//                        </Form.Group>
//                    </Modal.Body>
//                    <Modal.Footer>
//                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
//                            Cancel
//                        </Button>
//                        <Button variant="primary" type="submit">
//                            Create User
//                        </Button>
//                    </Modal.Footer>
//                </Form>
//            </Modal>

//            {/* Edit User Modal */}
//            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
//                <Modal.Header closeButton className="bg-primary text-white">
//                    <Modal.Title>Edit User</Modal.Title>
//                </Modal.Header>
//                <Form onSubmit={handleEditSubmit}>
//                    <Modal.Body>
//                        <FloatingLabel controlId="floatingEditName" label="Name" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Name"
//                                value={editForm.name}
//                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEditSurName" label="Surname" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Surname"
//                                value={editForm.surName}
//                                onChange={(e) => setEditForm({ ...editForm, surName: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEditEmail" label="Email" className="mb-3">
//                            <Form.Control
//                                type="email"
//                                placeholder="Email"
//                                value={editForm.email}
//                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEditSicilNo" label="Sicil No" className="mb-3">
//                            <Form.Control
//                                type="number"
//                                placeholder="Sicil No"
//                                value={editForm.sicilNo}
//                                onChange={(e) => setEditForm({ ...editForm, sicilNo: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>
//                    </Modal.Body>
//                    <Modal.Footer>
//                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//                            Cancel
//                        </Button>
//                        <Button variant="primary" type="submit">
//                            Save Changes
//                        </Button>
//                    </Modal.Footer>
//                </Form>
//            </Modal>

//            {/* Delete Confirmation Modal */}
//            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//                <Modal.Header closeButton className="bg-danger text-white">
//                    <Modal.Title>Confirm Delete</Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    Are you sure you want to delete user: <strong>{selectedUser?.name} {selectedUser?.surName}</strong>?
//                    <br />
//                    This action cannot be undone.
//                </Modal.Body>
//                <Modal.Footer>
//                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//                        Cancel
//                    </Button>
//                    <Button variant="danger" onClick={handleDelete}>
//                        Delete
//                    </Button>
//                </Modal.Footer>
//            </Modal>

//            {/* Success Toast */}
//            <Toast
//                show={showToast}
//                onClose={() => setShowToast(false)}
//                delay={3000}
//                autohide
//                className="position-fixed bottom-0 end-0 m-3"
//                bg="success"
//            >
//                <Toast.Header closeButton={false}>
//                    <strong className="me-auto">Success</strong>
//                </Toast.Header>
//                <Toast.Body className="text-white">{toastMessage}</Toast.Body>
//            </Toast>
//        </Container>
//    );
//};

//export default UserManagement;



//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { useAuth } from '../Contexts/AuthContext';
//import { useNavigate } from 'react-router-dom';
//import {
//    Container,
//    Table,
//    Button,
//    Modal,
//    Form,
//    Alert,
//    Spinner,
//    Badge,
//    InputGroup,
//    FloatingLabel,
//    Toast
//} from 'react-bootstrap';
//import { PencilSquare, Trash, PlusCircle, Search } from 'react-bootstrap-icons';

//const UserManagement = () => {
//    const { user: currentUser } = useAuth(); // currentUser olarak yeniden adlandýrdýk
//    const navigate = useNavigate();
//    const [users, setUsers] = useState([]);
//    const [loading, setLoading] = useState(true);
//    const [error, setError] = useState('');
//    const [showCreateModal, setShowCreateModal] = useState(false);
//    const [showEditModal, setShowEditModal] = useState(false);
//    const [showDeleteModal, setShowDeleteModal] = useState(false);
//    const [showRoleModal, setShowRoleModal] = useState(false); // Yeni eklenen rol deðiþtirme modalý
//    const [selectedUser, setSelectedUser] = useState(null);
//    const [searchTerm, setSearchTerm] = useState('');
//    const [showToast, setShowToast] = useState(false);
//    const [toastMessage, setToastMessage] = useState('');

//    // Form states
//    const [createForm, setCreateForm] = useState({
//        name: '',
//        surName: '',
//        email: '',
//        password: '',
//        sicilNo: '',
//        role: 'Instructor'
//    });

//    const [editForm, setEditForm] = useState({
//        name: '',
//        surName: '',
//        email: '',
//        sicilNo: ''
//    });

//    const [roleForm, setRoleForm] = useState({
//        role: 'Instructor'
//    });

//    const roles = ['Instructor', 'Department Secretary', 'Chair'];
//    const isChair = currentUser?.role === 'Chair';
//    const isSecretary = currentUser?.role === 'Department Secretary';

//    useEffect(() => {
//        if (!currentUser || (!isChair && !isSecretary)) {
//            navigate('/main');
//            return;
//        }

//        fetchUsers();
//    }, [currentUser, navigate]);

//    const fetchUsers = async () => {
//        try {
//            setLoading(true);
//            const response = await axios.get('/api/UserManagement');
//            setUsers(response.data);
//            setLoading(false);
//        } catch (err) {
//            setError('Failed to fetch users');
//            setLoading(false);
//            console.error(err);
//        }
//    };

//    const handleCreateSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            await axios.post('/api/UserManagement/create', createForm);
//            setShowCreateModal(false);
//            setCreateForm({
//                name: '',
//                surName: '',
//                email: '',
//                password: '',
//                sicilNo: '',
//                role: 'Instructor'
//            });
//            fetchUsers();
//            showSuccessToast('User created successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to create user');
//            console.error(err);
//        }
//    };

//    const handleEditSubmit = async (e) => {
//        e.preventDefault();
//        try {
//            await axios.put(`/api/UserManagement/update/${selectedUser.id}`, editForm);
//            setShowEditModal(false);
//            fetchUsers();
//            showSuccessToast('User updated successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to update user');
//            console.error(err);
//        }
//    };

//    const handleRoleChange = async (e) => {
//        e.preventDefault();
//        try {
//            await axios.put(`/api/UserManagement/update-role/${selectedUser.id}`, {
//                role: roleForm.role
//            });
//            setShowRoleModal(false);
//            fetchUsers();
//            showSuccessToast('User role updated successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to update user role');
//            console.error(err);
//        }
//    };

//    const handleDelete = async () => {
//        try {
//            await axios.delete(`/api/UserManagement/delete/${selectedUser.id}`);
//            setShowDeleteModal(false);
//            fetchUsers();
//            showSuccessToast('User deleted successfully!');
//        } catch (err) {
//            setError(err.response?.data || 'Failed to delete user');
//            console.error(err);
//        }
//    };

//    const showSuccessToast = (message) => {
//        setToastMessage(message);
//        setShowToast(true);
//        setTimeout(() => setShowToast(false), 3000);
//    };

//    const filteredUsers = users.filter(user =>
//        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        user.surName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//        user.sicilNo.toString().includes(searchTerm)
//    );

//    const getRoleBadge = (role) => {
//        const variant = role === 'Chair' ? 'danger' :
//            role === 'Department Secretary' ? 'warning' : 'primary';
//        return <Badge bg={variant} className="text-capitalize">{role}</Badge>;
//    };

//    return (
//        <Container className="py-5 mt-4">
//            <div className="d-flex justify-content-between align-items-center mb-4">
//                <h2 className="mb-0">
//                    <i className="bi bi-people-fill text-primary me-2"></i>
//                    User Management
//                </h2>
//                {isSecretary || isChair ? (
//                    <Button
//                        variant="primary"
//                        onClick={() => setShowCreateModal(true)}
//                        className="d-flex align-items-center"
//                    >
//                        <PlusCircle size={18} className="me-2" />
//                        Add New User
//                    </Button>
//                ) : null}
//            </div>

//            <InputGroup className="mb-4">
//                <InputGroup.Text>
//                    <Search />
//                </InputGroup.Text>
//                <Form.Control
//                    placeholder="Search users..."
//                    value={searchTerm}
//                    onChange={(e) => setSearchTerm(e.target.value)}
//                />
//            </InputGroup>

//            {error && <Alert variant="danger">{error}</Alert>}

//            {loading ? (
//                <div className="text-center py-5">
//                    <Spinner animation="border" variant="primary" />
//                    <p className="mt-2">Loading users...</p>
//                </div>
//            ) : (
//                <div className="table-responsive">
//                    <Table striped bordered hover className="shadow-sm">
//                        <thead className="bg-dark text-white">
//                            <tr>
//                                <th>#</th>
//                                <th>Name</th>
//                                <th>Email</th>
//                                <th>Sicil No</th>
//                                <th>Roles</th>
//                                <th>Actions</th>
//                            </tr>
//                        </thead>
//                        <tbody>
//                            {filteredUsers.map((user, index) => (
//                                <tr key={user.id}>
//                                    <td>{index + 1}</td>
//                                    <td>{user.name} {user.surName}</td>
//                                    <td>{user.email}</td>
//                                    <td>{user.sicilNo}</td>
//                                    <td>
//                                        {user.roles.map(role => (
//                                            <React.Fragment key={role}>
//                                                {getRoleBadge(role)}{' '}
//                                            </React.Fragment>
//                                        ))}
//                                    </td>
//                                    <td>
//                                        <Button
//                                            variant="outline-primary"
//                                            size="sm"
//                                            className="me-2"
//                                            onClick={() => {
//                                                setSelectedUser(user);
//                                                setEditForm({
//                                                    name: user.name,
//                                                    surName: user.surName,
//                                                    email: user.email,
//                                                    sicilNo: user.sicilNo
//                                                });
//                                                setShowEditModal(true);
//                                            }}
//                                        >
//                                            <PencilSquare size={16} />
//                                        </Button>
//                                        {isChair && (
//                                            <Button
//                                                variant="outline-info"
//                                                size="lg"
//                                                className="me-2"
//                                                onClick={() => {
//                                                    setSelectedUser(user);
//                                                    setRoleForm({
//                                                        role: user.roles[0] || 'Instructor'
//                                                    });
//                                                    setShowRoleModal(true);
//                                                }}
//                                            >
//                                                {/*<i className="bi bi-person-gear"></i>*/}
//                                                {/*<i className="bi bi-shuffle me-1"></i>*/}
//                                            </Button>
//                                        )}
//                                        <Button
//                                            variant="outline-danger"
//                                            size="sm"
//                                            onClick={() => {
//                                                setSelectedUser(user);
//                                                setShowDeleteModal(true);
//                                            }}
//                                        >
//                                            <Trash size={16} />
//                                        </Button>
//                                    </td>
//                                </tr>
//                            ))}
//                        </tbody>
//                    </Table>
//                </div>
//            )}

//            {/* Create User Modal */}
//            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
//                <Modal.Header closeButton className="bg-primary text-white">
//                    <Modal.Title>Create New User</Modal.Title>
//                </Modal.Header>
//                <Form onSubmit={handleCreateSubmit}>
//                    <Modal.Body>
//                        <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Name"
//                                value={createForm.name}
//                                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingSurName" label="Surname" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Surname"
//                                value={createForm.surName}
//                                onChange={(e) => setCreateForm({ ...createForm, surName: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
//                            <Form.Control
//                                type="email"
//                                placeholder="Email"
//                                value={createForm.email}
//                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
//                            <Form.Control
//                                type="password"
//                                placeholder="Password"
//                                value={createForm.password}
//                                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
//                                required
//                                minLength="6"
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingSicilNo" label="Sicil No" className="mb-3">
//                            <Form.Control
//                                type="number"
//                                placeholder="Sicil No"
//                                value={createForm.sicilNo}
//                                onChange={(e) => setCreateForm({ ...createForm, sicilNo: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        {/*<Form.Group className="mb-3">*/}
//                        {/*    <Form.Label>Role</Form.Label>*/}
//                        {/*    <Form.Select*/}
//                        {/*        value={createForm.role}*/}
//                        {/*        onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}*/}
//                        {/*        required*/}
//                        {/*    >*/}
//                        {/*        {roles.map(role => (*/}
//                        {/*            <option key={role} value={role}>{role}</option>*/}
//                        {/*        ))}*/}
//                        {/*    </Form.Select>*/}
//                        {/*</Form.Group>*/}

//                        {isChair && (
//                            <Form.Group className="mb-3">
//                                <Form.Label>Role</Form.Label>
//                                <Form.Select
//                                    value={createForm.role}
//                                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
//                                    required
//                                >
//                                    {roles.map(role => (
//                                        <option key={role} value={role}>{role}</option>
//                                    ))}
//                                </Form.Select>
//                            </Form.Group>
//                        )}

//                        {/* Secretary için varsayýlan rolü ayarla (gizli) */}
//                        {isSecretary && (
//                            <input
//                                type="hidden"
//                                value="Instructor"
//                                onChange={() => setCreateForm({ ...createForm, role: 'Instructor' })}
//                            />
//                        )}
//                    </Modal.Body>
//                    <Modal.Footer>
//                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
//                            Cancel
//                        </Button>
//                        <Button variant="primary" type="submit">
//                            Create User
//                        </Button>
//                    </Modal.Footer>
//                </Form>
//            </Modal>

//            {/* Edit User Modal */}
//            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
//                <Modal.Header closeButton className="bg-primary text-white">
//                    <Modal.Title>Edit User</Modal.Title>
//                </Modal.Header>
//                <Form onSubmit={handleEditSubmit}>
//                    <Modal.Body>
//                        <FloatingLabel controlId="floatingEditName" label="Name" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Name"
//                                value={editForm.name}
//                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEditSurName" label="Surname" className="mb-3">
//                            <Form.Control
//                                type="text"
//                                placeholder="Surname"
//                                value={editForm.surName}
//                                onChange={(e) => setEditForm({ ...editForm, surName: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEditEmail" label="Email" className="mb-3">
//                            <Form.Control
//                                type="email"
//                                placeholder="Email"
//                                value={editForm.email}
//                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>

//                        <FloatingLabel controlId="floatingEditSicilNo" label="Sicil No" className="mb-3">
//                            <Form.Control
//                                type="number"
//                                placeholder="Sicil No"
//                                value={editForm.sicilNo}
//                                onChange={(e) => setEditForm({ ...editForm, sicilNo: e.target.value })}
//                                required
//                            />
//                        </FloatingLabel>
//                    </Modal.Body>
//                    <Modal.Footer>
//                        <Button variant="red" onClick={() => setShowEditModal(false)}>
//                            Cancel
//                        </Button>
//                        <Button variant="primary" type="submit">
//                            Save Changes
//                        </Button>
//                    </Modal.Footer>
//                </Form>
//            </Modal>

//            {/* Role Change Modal - Sadece Chair görür */}
//            {isChair && (
//                <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
//                    <Modal.Header closeButton className="bg-info text-white">
//                        <Modal.Title>Change User Role</Modal.Title>
//                    </Modal.Header>
//                    <Form onSubmit={handleRoleChange}>
//                        <Modal.Body>
//                            <p>Changing role for: <strong>{selectedUser?.name} {selectedUser?.surName}</strong></p>
//                            <Form.Group className="mb-3">
//                                <Form.Label>New Role</Form.Label>
//                                <Form.Select
//                                    value={roleForm.role}
//                                    onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
//                                    required
//                                >
//                                    {roles.map(role => (
//                                        <option key={role} value={role}>{role}</option>
//                                    ))}
//                                </Form.Select>
//                            </Form.Group>
//                        </Modal.Body>
//                        <Modal.Footer>
//                            <Button variant="danger" onClick={() => setShowRoleModal(false)}>
//                                Cancel
//                            </Button>
//                            <Button variant="info" type="submit">
//                                Change Role
//                            </Button>
//                        </Modal.Footer>
//                    </Form>
//                </Modal>
//            )}

//            {/* Delete Confirmation Modal */}
//            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//                <Modal.Header closeButton className="bg-danger text-white">
//                    <Modal.Title>Confirm Delete</Modal.Title>
//                </Modal.Header>
//                <Modal.Body>
//                    Are you sure you want to delete user: <strong>{selectedUser?.name} {selectedUser?.surName}</strong>?
//                    <br />
//                    This action cannot be undone.
//                </Modal.Body>
//                <Modal.Footer>
//                    <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
//                        Cancel
//                    </Button>
//                    <Button variant="danger" onClick={handleDelete}>
//                        Delete
//                    </Button>
//                </Modal.Footer>
//            </Modal>

//            {/* Success Toast */}
//            <Toast
//                show={showToast}
//                onClose={() => setShowToast(false)}
//                delay={3000}
//                autohide
//                className="position-fixed bottom-0 end-0 m-3"
//                bg="success"
//            >
//                <Toast.Header closeButton={false}>
//                    <strong className="me-auto">Success</strong>
//                </Toast.Header>
//                <Toast.Body className="text-white">{toastMessage}</Toast.Body>
//            </Toast>
//        </Container>
//    );
//};

//export default UserManagement;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx'
import '../CSS/UserManagement.css';

import {
    Container,
    Table,
    Button,
    Modal,
    Form,
    Alert,
    Spinner,
    Badge,
    InputGroup,
    FloatingLabel,
    Toast,
    Offcanvas,
    Row,
    Col
} from 'react-bootstrap';
import { PencilSquare, Trash, PlusCircle, Search, PersonPlus, Gear, X } from 'react-bootstrap-icons';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Form states
    const [createForm, setCreateForm] = useState({
        name: '',
        surName: '',
        email: '',
        password: '',
        sicilNo: '',
        role: 'Instructor'
    });

    const [editForm, setEditForm] = useState({
        name: '',
        surName: '',
        email: '',
        sicilNo: ''
    });

    const [roleForm, setRoleForm] = useState({
        role: 'Instructor'
    });

    const roles = ['Instructor', 'Department Secretary', 'Chair'];
    const isChair = currentUser?.role === 'Chair';
    const isSecretary = currentUser?.role === 'Department Secretary';

    useEffect(() => {
        if (!currentUser || (!isChair && !isSecretary)) {
            navigate('/main');
            return;
        }
        fetchUsers();
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/UserManagement');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch users');
            setLoading(false);
            console.error(err);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/UserManagement/create', createForm);
            setShowCreateDrawer(false);
            setCreateForm({
                name: '',
                surName: '',
                email: '',
                password: '',
                sicilNo: '',
                role: 'Instructor'
            });
            fetchUsers();
            showSuccessToast('User created successfully!');
        } catch (err) {
            setError(err.response?.data || 'Failed to create user');
            console.error(err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/UserManagement/update/${selectedUser.id}`, editForm);
            setShowEditModal(false);
            fetchUsers();
            showSuccessToast('User updated successfully!');
        } catch (err) {
            setError(err.response?.data || 'Failed to update user');
            console.error(err);
        }
    };

    const handleRoleChange = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/UserManagement/update-role/${selectedUser.id}`, {
                role: roleForm.role
            });
            setShowRoleModal(false);
            fetchUsers();
            showSuccessToast('User role updated successfully!');
        } catch (err) {
            setError(err.response?.data || 'Failed to update user role');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/UserManagement/delete/${selectedUser.id}`);
            setShowDeleteModal(false);
            fetchUsers();
            showSuccessToast('User deleted successfully!');
        } catch (err) {
            setError(err.response?.data || 'Failed to delete user');
            console.error(err);
        }
    };

    const showSuccessToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.sicilNo.toString().includes(searchTerm)
    );

    const getRoleBadge = (role) => {
        const variant = role === 'Chair' ? 'danger' :
            role === 'Department Secretary' ? 'warning' : 'primary';
        return <Badge bg={variant} className="text-capitalize">{role}</Badge>;
    };

    //return (
    //    <>
    //    <Navbar />
    //        <Container fluid className="py-4 px-4">
    //        <Row className="mb-4 align-items-center">
    //            <Col>
    //                <h2 className="mb-0">
    //                    <i className="bi bi-people-fill text-primary me-2"></i>
    //                    User Management
    //                </h2>
    //            </Col>
    //            <Col xs="auto">
    //                {isSecretary || isChair ? (
    //                    <Button
    //                        variant="primary"
    //                        onClick={() => setShowCreateDrawer(true)}
    //                        className="d-flex align-items-center"
    //                    >
    //                        <PersonPlus size={18} className="me-2" />
    //                        Add New User
    //                    </Button>
    //                ) : null}
    //            </Col>
    //        </Row>

    //        <Row className="mb-4">
    //            <Col>
    //                <InputGroup>
    //                    <InputGroup.Text>
    //                        <Search />
    //                    </InputGroup.Text>
    //                    <Form.Control
    //                        placeholder="Search users..."
    //                        value={searchTerm}
    //                        onChange={(e) => setSearchTerm(e.target.value)}
    //                    />
    //                </InputGroup>
    //            </Col>
    //        </Row>

    //        {error && <Alert variant="danger">{error}</Alert>}

    //        {loading ? (
    //            <div className="text-center py-5">
    //                <Spinner animation="border" variant="primary" />
    //                <p className="mt-2">Loading users...</p>
    //            </div>
    //        ) : (
    //            <div className="table-responsive">
    //                <Table striped bordered hover className="shadow-sm">
    //                    <thead className="bg-dark text-white">
    //                        <tr>
    //                            <th>#</th>
    //                            <th>Name</th>
    //                            <th>Email</th>
    //                            <th>Sicil No</th>
    //                            <th>Roles</th>
    //                            <th>Actions</th>
    //                        </tr>
    //                    </thead>
    //                    <tbody>
    //                        {filteredUsers.map((user, index) => (
    //                            <tr key={user.id}>
    //                                <td>{index + 1}</td>
    //                                <td>{user.name} {user.surName}</td>
    //                                <td>{user.email}</td>
    //                                <td>{user.sicilNo}</td>
    //                                <td>
    //                                    {user.roles.map(role => (
    //                                        <React.Fragment key={role}>
    //                                            {getRoleBadge(role)}{' '}
    //                                        </React.Fragment>
    //                                    ))}
    //                                </td>
    //                                <td>
    //                                    <Button
    //                                        variant="outline-primary"
    //                                        size="sm"
    //                                        className="me-2"
    //                                        onClick={() => {
    //                                            setSelectedUser(user);
    //                                            setEditForm({
    //                                                name: user.name,
    //                                                surName: user.surName,
    //                                                email: user.email,
    //                                                sicilNo: user.sicilNo
    //                                            });
    //                                            setShowEditModal(true);
    //                                        }}
    //                                    >
    //                                        <PencilSquare size={16} />
    //                                    </Button>
    //                                    {isChair && (
    //                                        <Button
    //                                            variant="outline-info"
    //                                            size="sm"
    //                                            className="me-2"
    //                                            onClick={() => {
    //                                                setSelectedUser(user);
    //                                                setRoleForm({
    //                                                    role: user.roles[0] || 'Instructor'
    //                                                });
    //                                                setShowRoleModal(true);
    //                                            }}
    //                                        >
    //                                            <Gear size={16} />
    //                                        </Button>
    //                                    )}
    //                                    <Button
    //                                        variant="outline-danger"
    //                                        size="sm"
    //                                        onClick={() => {
    //                                            setSelectedUser(user);
    //                                            setShowDeleteModal(true);
    //                                        }}
    //                                    >
    //                                        <Trash size={16} />
    //                                    </Button>
    //                                </td>
    //                            </tr>
    //                        ))}
    //                    </tbody>
    //                </Table>
    //            </div>
    //        )}

    //        {/* Create User Drawer (Sað tarafta açýlýr panel) */}
    //        <Offcanvas
    //            show={showCreateDrawer}
    //            onHide={() => setShowCreateDrawer(false)}
    //            placement="end"
    //            className="w-50"
    //        >
    //            <Offcanvas.Header closeButton className="bg-primary text-white">
    //                <Offcanvas.Title className="d-flex align-items-center">
    //                    <PersonPlus size={20} className="me-2" />
    //                    Create New User
    //                </Offcanvas.Title>
    //            </Offcanvas.Header>
    //            <Offcanvas.Body>
    //                <Form onSubmit={handleCreateSubmit}>
    //                    <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
    //                        <Form.Control
    //                            type="text"
    //                            placeholder="Name"
    //                            value={createForm.name}
    //                            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingSurName" label="Surname" className="mb-3">
    //                        <Form.Control
    //                            type="text"
    //                            placeholder="Surname"
    //                            value={createForm.surName}
    //                            onChange={(e) => setCreateForm({ ...createForm, surName: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
    //                        <Form.Control
    //                            type="email"
    //                            placeholder="Email"
    //                            value={createForm.email}
    //                            onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
    //                        <Form.Control
    //                            type="password"
    //                            placeholder="Password"
    //                            value={createForm.password}
    //                            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
    //                            required
    //                            minLength="6"
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingSicilNo" label="Sicil No" className="mb-3">
    //                        <Form.Control
    //                            type="number"
    //                            placeholder="Sicil No"
    //                            value={createForm.sicilNo}
    //                            onChange={(e) => setCreateForm({ ...createForm, sicilNo: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    {isChair && (
    //                        <Form.Group className="mb-4">
    //                            <Form.Label>Role</Form.Label>
    //                            <Form.Select
    //                                value={createForm.role}
    //                                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
    //                                required
    //                            >
    //                                {roles.map(role => (
    //                                    <option key={role} value={role}>{role}</option>
    //                                ))}
    //                            </Form.Select>
    //                        </Form.Group>
    //                    )}

    //                    {isSecretary && (
    //                        <input
    //                            type="hidden"
    //                            value="Instructor"
    //                            onChange={() => setCreateForm({ ...createForm, role: 'Instructor' })}
    //                        />
    //                    )}

    //                    <div className="d-grid gap-2 mt-4">
    //                        <Button variant="primary" type="submit" size="lg">
    //                            Create User
    //                        </Button>
    //                        <Button
    //                            variant="outline-secondary"
    //                            onClick={() => setShowCreateDrawer(false)}
    //                            size="lg"
    //                        >
    //                            Cancel
    //                        </Button>
    //                    </div>
    //                </Form>
    //            </Offcanvas.Body>
    //        </Offcanvas>

    //        {/* Edit User Modal */}
    //        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
    //            <Modal.Header closeButton className="bg-primary text-white">
    //                <Modal.Title>Edit User</Modal.Title>
    //            </Modal.Header>
    //            <Form onSubmit={handleEditSubmit}>
    //                <Modal.Body>
    //                    <FloatingLabel controlId="floatingEditName" label="Name" className="mb-3">
    //                        <Form.Control
    //                            type="text"
    //                            placeholder="Name"
    //                            value={editForm.name}
    //                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingEditSurName" label="Surname" className="mb-3">
    //                        <Form.Control
    //                            type="text"
    //                            placeholder="Surname"
    //                            value={editForm.surName}
    //                            onChange={(e) => setEditForm({ ...editForm, surName: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingEditEmail" label="Email" className="mb-3">
    //                        <Form.Control
    //                            type="email"
    //                            placeholder="Email"
    //                            value={editForm.email}
    //                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>

    //                    <FloatingLabel controlId="floatingEditSicilNo" label="Sicil No" className="mb-3">
    //                        <Form.Control
    //                            type="number"
    //                            placeholder="Sicil No"
    //                            value={editForm.sicilNo}
    //                            onChange={(e) => setEditForm({ ...editForm, sicilNo: e.target.value })}
    //                            required
    //                        />
    //                    </FloatingLabel>
    //                </Modal.Body>
    //                <Modal.Footer>
    //                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
    //                        Cancel
    //                    </Button>
    //                    <Button variant="primary" type="submit">
    //                        Save Changes
    //                    </Button>
    //                </Modal.Footer>
    //            </Form>
    //        </Modal>

    //        {/* Role Change Modal */}
    //        {isChair && (
    //            <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
    //                <Modal.Header closeButton className="bg-info text-white">
    //                    <Modal.Title>Change User Role</Modal.Title>
    //                </Modal.Header>
    //                <Form onSubmit={handleRoleChange}>
    //                    <Modal.Body>
    //                        <p>Changing role for: <strong>{selectedUser?.name} {selectedUser?.surName}</strong></p>
    //                        <Form.Group className="mb-3">
    //                            <Form.Label>New Role</Form.Label>
    //                            <Form.Select
    //                                value={roleForm.role}
    //                                onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
    //                                required
    //                            >
    //                                {roles.map(role => (
    //                                    <option key={role} value={role}>{role}</option>
    //                                ))}
    //                            </Form.Select>
    //                        </Form.Group>
    //                    </Modal.Body>
    //                    <Modal.Footer>
    //                        <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
    //                            Cancel
    //                        </Button>
    //                        <Button variant="info" type="submit">
    //                            Change Role
    //                        </Button>
    //                    </Modal.Footer>
    //                </Form>
    //            </Modal>
    //        )}

    //        {/* Delete Confirmation Modal */}
    //        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
    //            <Modal.Header closeButton className="bg-danger text-white">
    //                <Modal.Title>Confirm Delete</Modal.Title>
    //            </Modal.Header>
    //            <Modal.Body>
    //                Are you sure you want to delete user: <strong>{selectedUser?.name} {selectedUser?.surName}</strong>?
    //                <br />
    //                This action cannot be undone.
    //            </Modal.Body>
    //            <Modal.Footer>
    //                <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
    //                    Cancel
    //                </Button>
    //                <Button variant="danger" onClick={handleDelete}>
    //                    Delete
    //                </Button>
    //            </Modal.Footer>
    //        </Modal>

    //        {/* Success Toast */}
    //        <Toast
    //            show={showToast}
    //            onClose={() => setShowToast(false)}
    //            delay={3000}
    //            autohide
    //            className="position-fixed bottom-0 end-0 m-3"
    //            bg="success"
    //        >
    //            <Toast.Header closeButton={false}>
    //                <strong className="me-auto">Success</strong>
    //            </Toast.Header>
    //            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
    //        </Toast>
    //    </Container>
    //    </>













        return (
        <>
                <Navbar />
                <Container fluid className="px-0" style={ { height: 'calc(100vh - 56px)' }}>
                {/*<Row className="mb-3 align-items-center">*/}
                {/*    <Col>*/}
                {/*        <h2 className="mb-0">*/}
                {/*            <i className="bi bi-people-fill text-primary me-2"></i>*/}
                {/*            User Management*/}
                {/*        </h2>*/}
                {/*    </Col>*/}
                {/*    <Col xs="auto">*/}
                {/*        {isSecretary || isChair ? (*/}
                {/*            <Button*/}
                {/*                variant="primary"*/}
                {/*                onClick={() => setShowCreateDrawer(true)}*/}
                {/*                className="d-flex align-items-center"*/}
                {/*            >*/}
                {/*                <PersonPlus size={18} className="me-2" />*/}
                {/*                Add New User*/}
                {/*            </Button>*/}
                {/*        ) : null}*/}
                {/*    </Col>*/}
                {/*</Row>*/}

                {/*<Row className="mb-3">*/}
                {/*    <Col>*/}
                {/*        <InputGroup>*/}
                {/*            <InputGroup.Text>*/}
                {/*                <Search />*/}
                {/*            </InputGroup.Text>*/}
                {/*            <Form.Control*/}
                {/*                placeholder="Search users..."*/}
                {/*                value={searchTerm}*/}
                {/*                onChange={(e) => setSearchTerm(e.target.value)}*/}
                {/*            />*/}
                {/*        </InputGroup>*/}
                {/*    </Col>*/}
                {/*</Row>*/}

                {/*{error && <Alert variant="danger">{error}</Alert>}*/}

                {/*{loading ? (*/}
                {/*    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>*/}
                {/*        <Spinner animation="border" variant="primary" />*/}
                {/*        <p className="mt-2 ms-2">Loading users...</p>*/}
                {/*    </div>*/}
                {/*) : (*/}
                {/*    <div className="table-container" style={{*/}
                {/*        width:'100%',*/}
                {/*        height: 'calc(100vh - 200px)',*/}
                {/*        overflowY: 'auto',*/}
                {/*        border: '1px solid #dee2e6',*/}
                {/*        borderRadius: '0.25rem'*/}
                {/*    }}>*/}
                {/*        <Table striped bordered hover className="mb-0">*/}
                {/*            <thead className="bg-dark text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>*/}
                {/*                <tr>*/}
                {/*                    <th style={{ width: '5%' }}>#</th>*/}
                {/*                    <th style={{ width: '20%' }}>Name</th>*/}
                {/*                    <th style={{ width: '25%' }}>Email</th>*/}
                {/*                    <th style={{ width: '10%' }}>Sicil No</th>*/}
                {/*                    <th style={{ width: '20%' }}>Roles</th>*/}
                {/*                    <th style={{ width: '20%' }}>Actions</th>*/}
                {/*                </tr>*/}
                {/*            </thead>*/}
                {/*            <tbody>*/}
                {/*                {filteredUsers.map((user, index) => (*/}
                {/*                    <tr key={user.id}>*/}
                {/*                        <td>{index + 1}</td>*/}
                {/*                        <td>{user.name} {user.surName}</td>*/}
                {/*                        <td>{user.email}</td>*/}
                {/*                        <td>{user.sicilNo}</td>*/}
                {/*                        <td>*/}
                {/*                            {user.roles.map(role => (*/}
                {/*                                <React.Fragment key={role}>*/}
                {/*                                    {getRoleBadge(role)}{' '}*/}
                {/*                                </React.Fragment>*/}
                {/*                            ))}*/}
                {/*                        </td>*/}
                {/*                        <td>*/}
                {/*                            <Button*/}
                {/*                                variant="outline-primary"*/}
                {/*                                size="sm"*/}
                {/*                                className="me-2"*/}
                {/*                                onClick={() => {*/}
                {/*                                    setSelectedUser(user);*/}
                {/*                                    setEditForm({*/}
                {/*                                        name: user.name,*/}
                {/*                                        surName: user.surName,*/}
                {/*                                        email: user.email,*/}
                {/*                                        sicilNo: user.sicilNo*/}
                {/*                                    });*/}
                {/*                                    setShowEditModal(true);*/}
                {/*                                }}*/}
                {/*                            >*/}
                {/*                                <PencilSquare size={16} />*/}
                {/*                            </Button>*/}
                {/*                            {isChair && (*/}
                {/*                                <Button*/}
                {/*                                    variant="outline-info"*/}
                {/*                                    size="sm"*/}
                {/*                                    className="me-2"*/}
                {/*                                    onClick={() => {*/}
                {/*                                        setSelectedUser(user);*/}
                {/*                                        setRoleForm({*/}
                {/*                                            role: user.roles[0] || 'Instructor'*/}
                {/*                                        });*/}
                {/*                                        setShowRoleModal(true);*/}
                {/*                                    }}*/}
                {/*                                >*/}
                {/*                                    <Gear size={16} />*/}
                {/*                                </Button>*/}
                {/*                            )}*/}
                {/*                            <Button*/}
                {/*                                variant="outline-danger"*/}
                {/*                                size="sm"*/}
                {/*                                onClick={() => {*/}
                {/*                                    setSelectedUser(user);*/}
                {/*                                    setShowDeleteModal(true);*/}
                {/*                                }}*/}
                {/*                            >*/}
                {/*                                <Trash size={16} />*/}
                {/*                            </Button>*/}
                {/*                        </td>*/}
                {/*                    </tr>*/}
                {/*                ))}*/}
                {/*            </tbody>*/}
                {/*        </Table>*/}
                {/*    </div>*/}
                {/*)}*/}
                    <Container className="px-4 py-4">
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <h2 className="mb-0">
                                    <i className="bi bi-people-fill text-primary me-2"></i>
                                    User Management
                                </h2>
                            </Col>
                            <Col xs="auto">
                                {isSecretary || isChair ? (
                                    <Button
                                        variant="primary"
                                        onClick={() => setShowCreateDrawer(true)}
                                        className="d-flex align-items-center"
                                    >
                                        <PersonPlus size={18} className="me-2" />
                                        Add New User
                                    </Button>
                                ) : null}
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <Search />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>

                        {error && <Alert variant="danger">{error}</Alert>}

                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 ms-2">Loading users...</p>
                            </div>
                        ) : (
                            <div className="table-container" style={{
                                width: '100%',
                                height: 'calc(100vh - 200px)',
                                overflowY: 'auto',
                                border: '1px solid #dee2e6',
                                borderRadius: '0.25rem'
                            }}>
                                <Table striped bordered hover className="mb-0 w-100">
                                    <thead className="bg-dark text-white" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                        <tr>
                                            <th style={{ width: '5%' }}>#</th>
                                            <th style={{ width: '20%' }}>Name</th>
                                            <th style={{ width: '25%' }}>Email</th>
                                            <th style={{ width: '10%' }}>Sicil No</th>
                                            <th style={{ width: '20%' }}>Roles</th>
                                            <th style={{ width: '20%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, index) => (
                                            <tr key={user.id}>
                                                <td>{index + 1}</td>
                                                <td>{user.name} {user.surName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.sicilNo}</td>
                                                <td>
                                                    {user.roles.map(role => (
                                                        <React.Fragment key={role}>
                                                            {getRoleBadge(role)}{' '}
                                                        </React.Fragment>
                                                    ))}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setEditForm({
                                                                name: user.name,
                                                                surName: user.surName,
                                                                email: user.email,
                                                                sicilNo: user.sicilNo
                                                            });
                                                            setShowEditModal(true);
                                                        }}
                                                    >
                                                        <PencilSquare size={16} />
                                                    </Button>
                                                    {isChair && (
                                                        <Button
                                                            variant="outline-info"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setRoleForm({
                                                                    role: user.roles[0] || 'Instructor'
                                                                });
                                                                setShowRoleModal(true);
                                                            }}
                                                        >
                                                            <Gear size={16} />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        <Trash size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Container>
                {/* Create User Drawer (Sað tarafta açýlýr panel) */}
                <Offcanvas
                    show={showCreateDrawer}
                    onHide={() => setShowCreateDrawer(false)}
                    placement="end"
                    style={{ width: '35%' }}
                >
                    <Offcanvas.Header closeButton className="bg-primary text-white">
                        <Offcanvas.Title className="d-flex align-items-center">
                            <PersonPlus size={20} className="me-2" />
                            Create New User
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Form onSubmit={handleCreateSubmit}>
                                {/* Form içeriði ayný kalacak */}
                                <FloatingLabel controlId="floatingName" label="Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        value={createForm.name}
                                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingSurName" label="Surname" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Surname"
                                        value={createForm.surName}
                                        onChange={(e) => setCreateForm({ ...createForm, surName: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={createForm.email}
                                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={createForm.password}
                                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                        required
                                        minLength="6"
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingSicilNo" label="Sicil No" className="mb-3">
                                    <Form.Control
                                        type="number"
                                        placeholder="Sicil No"
                                        value={createForm.sicilNo}
                                        onChange={(e) => setCreateForm({ ...createForm, sicilNo: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                {isChair && (
                                    <Form.Group className="mb-4">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select
                                            value={createForm.role}
                                            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                                            required
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {isSecretary && (
                                    <input
                                        type="hidden"
                                        value="Instructor"
                                        onChange={() => setCreateForm({ ...createForm, role: 'Instructor' })}
                                    />
                                )}

                                <div className="d-grid gap-2 mt-4">
                                    <Button variant="primary" type="submit" size="lg">
                                        Create User
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowCreateDrawer(false)}
                                        size="lg"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                        </Form>
                    </Offcanvas.Body>
                </Offcanvas>
                    {/* Edit User Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                        <Modal.Header closeButton className="bg-primary text-white">
                            <Modal.Title>Edit User</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={handleEditSubmit}>
                            <Modal.Body>
                                <FloatingLabel controlId="floatingEditName" label="Name" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingEditSurName" label="Surname" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Surname"
                                        value={editForm.surName}
                                        onChange={(e) => setEditForm({ ...editForm, surName: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingEditEmail" label="Email" className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="floatingEditSicilNo" label="Sicil No" className="mb-3">
                                    <Form.Control
                                        type="number"
                                        placeholder="Sicil No"
                                        value={editForm.sicilNo}
                                        onChange={(e) => setEditForm({ ...editForm, sicilNo: e.target.value })}
                                        required
                                    />
                                </FloatingLabel>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>

                    {/* Role Change Modal */}
                    {isChair && (
                        <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)} centered>
                            <Modal.Header closeButton className="bg-info text-white">
                                <Modal.Title>Change User Role</Modal.Title>
                            </Modal.Header>
                            <Form onSubmit={handleRoleChange}>
                                <Modal.Body>
                                    <p>Changing role for: <strong>{selectedUser?.name} {selectedUser?.surName}</strong></p>
                                    <Form.Group className="mb-3">
                                        <Form.Label>New Role</Form.Label>
                                        <Form.Select
                                            value={roleForm.role}
                                            onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                                            required
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="info" type="submit">
                                        Change Role
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    )}

                    {/* Delete Confirmation Modal */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                        <Modal.Header closeButton className="bg-danger text-white">
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete user: <strong>{selectedUser?.name} {selectedUser?.surName}</strong>?
                            <br />
                            This action cannot be undone.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Success Toast */}
                    <Toast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                        delay={3000}
                        autohide
                        className="position-fixed bottom-0 end-0 m-3"
                        bg="success"
                    >
                        <Toast.Header closeButton={false}>
                            <strong className="me-auto">Success</strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                    </Toast>
                {/* Diðer modal ve toastlar ayný kalacak */}
            </Container>
        </>
    );
    
};

export default UserManagement;