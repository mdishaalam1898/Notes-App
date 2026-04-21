import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const API = "http://localhost:5000/notes";

  // Load dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(JSON.parse(savedMode));
  }, []);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  //  Fetch Notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const res = await axios.get(API);
    setNotes(res.data);
    setLoading(false);
  };

  //  Add Note
  const addNote = async () => {
    if (!title || !description) return;

    setLoading(true);
    await axios.post(API, { title, description });
    setTitle("");
    setDescription("");
    fetchNotes();
  };

  // Delete
  const deleteNote = async (id) => {
    setLoading(true);
    await axios.delete(`${API}/${id}`);
    fetchNotes();
  };

  // Update
  const updateNote = async (id) => {
    await axios.put(`${API}/${id}`, {
      title: editTitle,
      description: editDescription,
    });
    setEditId(null);
    fetchNotes();
  };

  //  Search
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      
      {/* HEADER */}
      <div className="header">
        <h1> Notes App</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADD NOTE */}
      <div className="form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      {loading && <p>Loading...</p>}

      {/* NOTES */}
      <div className="notes-container">
        {filteredNotes.length ? (
          filteredNotes.map((note) => (
            <div key={note._id} className="note">
              {editId === note._id ? (
                <>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <button onClick={() => updateNote(note._id)}>Save</button>
                </>
              ) : (
                <>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                  <small>
                    {new Date(note.createdAt).toLocaleString()}
                  </small>

                  <div>
                    <button
                      onClick={() => {
                        setEditId(note._id);
                        setEditTitle(note.title);
                        setEditDescription(note.description);
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button onClick={() => deleteNote(note._id)}>
                      🗑 Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-notes">No notes found 🗒️</p>
        )}
      </div>
    </div>
  );
};

export default App;