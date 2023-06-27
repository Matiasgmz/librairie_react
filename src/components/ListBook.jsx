import React, { useState, useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import SearchBar from './SearchBar';


export default function ListBook() {
    const [books, setBooks] = useState([]);
    const [showModalModify, setShowModalModify] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [bookData, setBookData] = useState({
        id: '',
        titre: '',
        description: '',
        auteur: '',
        prix: '',
    });

    const [newBookData, setNewBookData] = useState({
        titre: '',
        description: '',
        auteur: '',
        prix: '',
    });


    // get data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/book');
                const booksData = response.data;
                setBooks(booksData);
                console.log(booksData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // delete data
    const handleDeleteBook = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/book/${id}`);
            setBooks(books.filter((book) => book.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    // put data
    const openModal = (book) => {
        setBookData({
            id: book.id,
            titre: book.titre,
            description: book.description,
            auteur: book.auteur,
            prix: book.prix,
        });
        setShowModalModify(true);
    };

    const closeModalModify = () => {
        setShowModalModify(false);
    };

    const handleChange = (e) => {
        setBookData({
            ...bookData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Effectuez une requête HTTP pour mettre à jour le livre avec les nouvelles valeurs
            await axios.put(`http://localhost:3000/book/${bookData.id}`, bookData);

            // Mettez à jour la liste des livres avec le livre modifié
            setBooks((prevBooks) =>
                prevBooks.map((book) =>
                    book.id === bookData.id ? { ...book, ...bookData } : book
                )
            );

            closeModalModify();
        } catch (error) {
            console.error(error);
        }
    };

    // search data
    const handleSearch = (query) => {
        const lowercaseQuery = query.toLowerCase();

        const filteredBooks = books.filter((book) =>
            book.titre.toLowerCase().includes(lowercaseQuery)
        );

        setBooks(filteredBooks.length > 0 || lowercaseQuery === '' ? filteredBooks : []);
    };

    // add data
    const openAddModal = () => {
        setNewBookData({
            titre: '',
            description: '',
            auteur: '',
            prix: '',
        });
        setShowModalAdd(true);
    };

    const handleNewBookChange = (e) => {
        setNewBookData({
            ...newBookData,
            [e.target.name]: e.target.value,
        });
    };


    const closeModalAdd = () => {
        setShowModalAdd(false);
    };
    const handleAddBookSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://localhost:3000/book', newBookData);


            setBooks([...books, response.data]);

            closeModalAdd();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <SearchBar handleSearch={handleSearch}></SearchBar>

            <Accordion className='w-25 mt-5 mx-auto' defaultActiveKey={1}>
                <Button variant="primary" className='my-3' onClick={openAddModal}>
                    Ajouter un livre
                </Button>
                {books.map((book) =>
                    <Accordion.Item key={book.id} eventKey={book.id}>
                        <Accordion.Header className='fw-bold'>
                            #{book.id}
                            <FontAwesomeIcon className='mx-2' icon={faBook} />
                            {book.titre}
                        </Accordion.Header>
                        <Accordion.Body>
                            <p>{book.description}</p>
                            <p className='fw-bold'>- {book.auteur} -</p>


                            <div className='d-flex justify-content-between'>
                                <div>
                                    <Button
                                        variant="transparent"
                                        onClick={() => openModal(book)}
                                    >
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </Button>

                                    <Button
                                        variant="transparent"
                                        onClick={() => handleDeleteBook(book.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </Button>

                                </div>
                                <p className='text-end m-0 align-self-center'>Prix : <span className='fw-bold'>{book.prix}$</span></p>
                            </div>

                        </Accordion.Body>
                    </Accordion.Item>
                )}

            </Accordion>

            {/* Modal pour modifier  */}
            <Modal show={showModalModify} onHide={closeModalModify}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier le livre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitre">
                            <Form.Label>Titre</Form.Label>
                            <Form.Control
                                type="text"
                                name="titre"
                                value={bookData.titre}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={bookData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formAuteur">
                            <Form.Label>Auteur</Form.Label>
                            <Form.Control
                                type="text"
                                name="auteur"
                                value={bookData.auteur}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrix">
                            <Form.Label>Prix</Form.Label>
                            <Form.Control
                                type="number"
                                name="prix"
                                value={bookData.prix}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button variant="primary" className='mt-5' type="submit">
                            Valider
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal add  */}

            <Modal show={showModalAdd} onHide={closeModalAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un livre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddBookSubmit}>
                        <Form.Group controlId="formTitre">
                            <Form.Label>Titre</Form.Label>
                            <Form.Control
                                type="text"
                                name="titre"
                                value={newBookData.titre}
                                onChange={handleNewBookChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={newBookData.description}
                                onChange={handleNewBookChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formAuteur">
                            <Form.Label>Auteur</Form.Label>
                            <Form.Control
                                type="text"
                                name="auteur"
                                value={newBookData.auteur}
                                onChange={handleNewBookChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPrix">
                            <Form.Label>Prix</Form.Label>
                            <Form.Control
                                type="number"
                                name="prix"
                                value={newBookData.prix}
                                onChange={handleNewBookChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" className="mt-5" type="submit">
                            Ajouter
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
