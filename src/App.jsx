import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import s from "./App.module.css";

Modal.setAppElement('#root');

const App = () => {
    const [applications, setApplications] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newSource, setNewSource] = useState(''); // Новое поле "Источник заявки"
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    // Загрузка заявок из сервера
    useEffect(() => {
        axios.get('http://localhost:5001/applications')
            .then(res => setApplications(res.data))
            .catch(err => console.error(err));
    }, []);

    // Добавление новой заявки
    const handleAddApplication = () => {
        const now = new Date();
        const newApplication = {
            id: Date.now(),
            title: newTitle,
            description: newDescription,
            source: newSource,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            completed: false,
        };

        axios.post('http://localhost:5001/applications', newApplication)
            .then(() => {
                setApplications([...applications, newApplication]);
                setNewTitle('');
                setNewDescription('');
                setNewSource('');
            })
            .catch(err => console.error(err));
    };

    // Открытие модалки
    const openModal = (application) => {
        setSelectedApplication(application);
        setModalOpen(true);
    };

    // Закрытие модалки
    const closeModal = () => {
        setModalOpen(false);
        setSelectedApplication(null);
    };

    // Обновление заявки
    const handleUpdateApplication = (updatedApplication) => {
        const updatedApplications = applications.map(app =>
            app.id === updatedApplication.id ? updatedApplication : app
        );

        axios.put('http://localhost:5001/applications', updatedApplications)
            .then(() => setApplications(updatedApplications))
            .catch(err => console.error(err));

        closeModal();
    };

    return (
        <div className={s.container}>
            <h1>Job Vacancy</h1>
            <input
                className={s.input}
                type="text"
                placeholder="Company name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
            />
            <textarea
                className={s.description}
                placeholder="Job description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />
            <input
                className={s.input}
                type="text"
                placeholder="Application source (e.g., LinkedIn)"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
            />
            <button className={s.button} onClick={handleAddApplication}>Add vacancy</button>
            <ul>
                {applications.map(app => (
                    <li key={app.id} onClick={() => openModal(app)}>
                        <span style={{ textDecoration: app.completed ? 'line-through' : 'none' }}>
                            {app.title} - {app.date} {app.time} - {app.source}
                        </span>
                    </li>
                ))}
            </ul>

            {modalOpen && selectedApplication && (
                <Modal 
                    isOpen={modalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Application Details"
                >
                  <div className={s.modal}>
                    <h2>Edit Vacancy</h2>
                    <label>Company name</label>
                    <input
                    className={s.modalInput}
                        type="text"
                        value={selectedApplication.title}
                        onChange={(e) =>
                            setSelectedApplication({ ...selectedApplication, title: e.target.value })
                        }
                    />
                    <label>Job Description</label>
                    <textarea
                    className={s.modalDescription}
                        value={selectedApplication.description}
                        onChange={(e) =>
                            setSelectedApplication({ ...selectedApplication, description: e.target.value })
                        }
                    />
                    <label>Source link</label>
                    <input
                    className={s.modalWebsite}
                        type="text"
                        value={selectedApplication.source}
                        onChange={(e) =>
                            setSelectedApplication({ ...selectedApplication, source: e.target.value })
                        }
                    />
                    <div className={s.modalbtns}>
                    <button 
                    className={s.modalBtn}
                    onClick={() =>
                        handleUpdateApplication({ ...selectedApplication, completed: !selectedApplication.completed })
                    }>
                        {selectedApplication.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button 
                     className={s.modalBtn}
                    onClick={() => handleUpdateApplication(selectedApplication)}>Save</button>
                    <button
                     className={s.modalBtn}
                    onClick={closeModal}>Close</button>
                    </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default App;
