//notes is used for modular routing purposes
const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
//uuid is a node package that creates a unique id for each note so they can be identified by it
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

//GET request to read the db file containing notes
notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });

//POST request to recieve notes and give them a unique id
notes.post('/', (req, res) => {
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuidv4(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json('Note added');
    } 
});

//DELETE request that removes an entry from the db.json file based on its unique note id
notes.delete('/:note_id', (req, res) => {
  //creates a variable and assigns it the note id from the request parameters
  const noteId = req.params.note_id;
  //reads from the database file
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      //result is populated by using the filter method to check the db.json and return only values that don't match the noteId. 
      const result = json.filter((note) => note.note_id !== noteId);

      return result;
    })
    .then((result) => {
      //new variable that contains the filtered results and stringify them because fs.writeFile only passes strings not objects.
      const updatedData = JSON.stringify(result);
      fs.writeFile('./db/db.json', updatedData, (err) => {
        //error for writefile
        if (err) {
          console.error(err);
          res.status(500).json('Error deleting note');
          return;
        }
        res.json('Note deleted');
      });
    })
    //error for promise
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error deleting note');
    });
});

module.exports = notes;