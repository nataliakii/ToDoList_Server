const { Schema, model} = require('mongoose');

const taskSchema = {
    id: { type: Schema.Types.ObjectId},
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  done: { type: Boolean, default: false, required: true }
  };

const Task = model('Task', taskSchema);

module.exports = Task;