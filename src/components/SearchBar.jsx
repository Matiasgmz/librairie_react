import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

export default function SearchBar({ handleSearch }) {


    const handleChange = (e) => {
        if (e.target.value != '') {
            handleSearch(e.target.value);

        }
    };

    return (
        <Form className='w-25 mx-auto'>
            <Form.Control
                type="text"
                placeholder="Rechercher par titre"
                onChange={handleChange}
            />
        </Form>
    );
}