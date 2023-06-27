import React from 'react'

export default function AddBook() {
    const [newBookData, setAddBookData] = useState({
        id: '',
        titre: '',
        description: '',
        auteur: '',
        prix: '',
    });
  return (
    <div>AddBook</div>
  )
}
