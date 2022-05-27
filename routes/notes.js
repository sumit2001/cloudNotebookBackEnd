const express = require('express');
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require('../models/Note')
const { body, validationResult } = require('express-validator');

//Route 1: Get all Notes /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
});

//Route 2: add notes /api/notes/addnote
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save();
        res.json(saveNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
});


//Route 3: update notes /api/notes/updatenote

router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find note

        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

});

//Route 4: delete notes /api/notes/deletenote

router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    //find note
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { res.status(404).send("Not Found") }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }

});

module.exports = router;