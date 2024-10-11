const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
// POST /tasks - Créer une nouvelle tâche
router.post('/', async (req, res) => {
  try {
    const { assigned_to } = req.body;

    let assignedUser = null;
    if (assigned_to) {
      // Rechercher l'utilisateur par son ID avant d'assigner la tâche
      assignedUser = await User.findById(assigned_to);
      if (!assignedUser) {
        return res.status(400).send('Utilisateur assigné non trouvé.');
      }
    }

    const task = new Task({
      ...req.body,
      assigned_to: assignedUser ? assignedUser._id : null // Assigner l'ID de l'utilisateur s'il existe
    });

    await task.save();
    res.status(201).send(task);
  } catch (err) {
    console.error(`Error creating task: ${err.message}`);
    res.status(400).send(err.message);
  }
});

// PUT /tasks/:id - Modifier une tâche existante
router.put('/:id', async (req, res) => {
  try {
    const { assigned_to, status } = req.body;

    // Vérifier si le statut est l'une des valeurs autorisées
    const validStatuses = ['terminé', 'en cours', 'à faire'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).send('Statut invalide. Les statuts valides sont : terminé, en cours, à faire.');
    }

    let assignedUser = null;
    if (assigned_to) {
      // Vérifier si l'utilisateur existe lors de la mise à jour
      assignedUser = await User.findById(assigned_to);
      if (!assignedUser) {
        return res.status(400).send('Utilisateur assigné non trouvé.');
      }
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, assigned_to: assignedUser ? assignedUser._id : null },
      { new: true }
    );

    if (!task) {
      return res.status(404).send('Tâche non trouvée');
    }

    res.send(task);
  } catch (err) {
    console.error(`Error updating task: ${err.message}`);
    res.status(400).send(err.message);
  }
});


// DELETE /tasks/:id - Supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      console.log(`Task not found for deletion: ID ${req.params.id}`);
      return res.status(404).send('Task not found');
    }
    console.log(`Task deleted: ID ${req.params.id}`);
    res.send('Task deleted');
  } catch (err) {
    console.error(`Error deleting task: ${err.message}`);
    res.status(400).send(err);
  }
});

// GET /tasks/user/:user_id - Récupérer les tâches assignées à un utilisateur
router.get('/user/:user_id', async (req, res) => {
  try {
    const tasks = await Task.find({ assigned_to: req.params.user_id })
      .populate('assigned_to', 'name'); // Peupler le champ assigned_to

    console.log(`Tasks fetched for user: ID ${req.params.user_id}, Count: ${tasks.length}`);
    res.send(tasks);
  } catch (err) {
    console.error(`Error fetching tasks for user: ${err.message}`);
    res.status(400).send(err);
  }
});

// PATCH /tasks/:id/status - Changer le statut d'une tâche
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    // Vérifier si le statut est l'une des valeurs autorisées
    const validStatuses = ['terminé', 'en cours', 'à faire'];
    if (!validStatuses.includes(status)) {
      return res.status(400).send('Statut invalide. Les statuts valides sont : terminé, en cours, à faire.');
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log(`Task not found for status update: ID ${req.params.id}`);
      return res.status(404).send('Task not found');
    }

    // Mettre à jour le statut de la tâche
    task.status = status;
    await task.save();
    console.log(`Task status updated: ID ${task._id}, New Status: ${task.status}`);
    res.send(task);
  } catch (err) {
    console.error(`Error updating task status: ${err.message}`);
    res.status(400).send(err);
  }
});

module.exports = router;
