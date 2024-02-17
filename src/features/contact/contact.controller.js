const Contact = require('../../shared/db/mongodb/schemas/contact.Schema')

const storageContactUs = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        console.log(contact)
        res.status(201).json({ msg: 'Contact created', data: contact });
   } catch (error) {
    res.status(400).json({ msg: 'Error creating contact', error: error });
}
}

module.exports = {
    storageContactUs
};

