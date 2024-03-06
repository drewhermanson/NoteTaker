const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');


notes.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    
  });

notes.post('/', (req, res) => {
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json('Note added');
    } else {
      res.error('Error in adding note');
    }
});

notes.delete('/api/notes/:note_id', (req, res) => {
    const noteId = req.params.note_id;
    readFromFile('./db/notes.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.note_id !== noteId);
  
        readAndAppend(result, './db/notes.json');
  
        res.json(`Item ${noteId} has been deleted 🗑️`);
      });
});

module.exports = notes;