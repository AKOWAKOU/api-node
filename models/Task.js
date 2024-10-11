const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enu:['à faire','en cours','terminé'],
    default:'à faire'
  },
  due_date: {
    type: Date,
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assurez-vous que cela référence votre modèle User
    required: false, // Rendre ce champ facultatif
  },
});

module.exports = mongoose.model('Task', taskSchema);
