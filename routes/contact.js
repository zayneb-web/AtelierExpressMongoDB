var express = require('express');
var router = express.Router();
//import collection (BD)
var Contact= require('../Models/contact')

/////////////////////////////// ADD

router.post('/list', async function(req, res, next) {
    try {
        const newContact = new Contact({
            FullName: req.body.FullName,
            Phone: req.body.Phone
        });
        // Save the new contact
        const savedContact = await newContact.save();
        console.log(savedContact);
        // Render the page with a success message
        res.render('form.twig', {
            title: "Contact List",
            cont: await Contact.find(),
            message: "Contact Added"
        });
    } catch (err) {
        console.error("Error saving contact:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
  

// /////////////////////////////// READ 

 
router.get('/list', function(req, res, next) {
    Contact.find().then(
        contacts => {
            res.render(
                'form.twig',
                { title: "Contact list", cont: contacts }
            );
        }
    );
});

///////////////////////////////// DELETE 

router.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const deletedContact = await Contact.findByIdAndDelete(id);
      if (!deletedContact) {
        return res.status(404).send("Contact not found");
      }
      res.redirect("/contact/list");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting data");
    }
  });

// /////////////////////////////// UPDATE 


router.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).send("Contact not found");
        }
        res.render("edit_contact.twig", { contact: contact });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching contact data");
    }
});

//
router.post("/edit/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            {
                FullName: req.body.FullName,
                Phone: req.body.Phone
            },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).send("Contact not found");
        }

        // Render the page with a success message
        res.render('form.twig', {
            title: "Contact List",
            cont: await Contact.find(),
            message: "Contact Updated"
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating contact data");
    }
});


router.get("/search", async (req, res) => {
    const { fullName } = req.query;


    try {
      // Use a regular expression for case-insensitive search
      const contacts = await Contact.find({ FullName: { $regex: new RegExp(fullName, 'i') } });
      res.render("form.twig", { cont: contacts });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
