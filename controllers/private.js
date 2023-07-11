const express = require( 'express' );
const User = require( '../model/user' );
const Task = require( '../model/tasks' );

exports.addTask = async ( req, res ) =>
{
    try
    {
        console.log(req.body)
        const { userId, title } = req.body;
        //Create new task and save it
        const task = new Task( { userId, title } );
        console.log(task)
        await task.save();
        // Find the user by their ID and add the task to their tasks array
        const user = await User.findByIdAndUpdate(
          userId,
          { $push: { tasks: task._id } },
          { new: true }
        ).populate( 'tasks' );
        console.log( user )
        console.log(user.tasks)
    
        res.status(200).send({ tasks: user.tasks });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
      }
}

exports.fetchTasks = async (req, res) => {
    try
    {
        console.log( "fetch Tasks hit" )
        console.log( req.params )
        let { userId } = req.params;
        userId = userId.trim();
        console.log( userId )
  
      // Find the user by their ID and populate the tasks field
        const user = await User.findById( userId ).populate( 'tasks' );
        console.log(user.tasks)
  
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
        
  
      res.status(200).send({ tasks: user.tasks });
    } catch (error) {
      res.status(500).send({ error: 'Server error' });
    }
  };

exports.deleteTask = async ( req, res ) =>
{
    try {
        const { taskId } = req.params;
    
        const task = await Task.findById(taskId);
    
        if (!task) {
          return res.status(404).send({ error: 'Task not found' });
        }
    
        // Find the user by their ID and remove the task from their tasks array
        const user = await User.findByIdAndUpdate(
          task.userId,
          { $pull: { tasks: taskId } },
          { new: true }
        ).populate('tasks');
    
        // Delete the task
        await Task.findByIdAndDelete( taskId );
        
    
        res.status(200).send({ tasks: user.tasks});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}

// Update the task's title
exports.editTask = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { title } = req.body;
  
      // Find the task by its ID and update the title
      const task = await Task.findByIdAndUpdate(
        taskId,
        { title },
        { new: true }
      );
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).send(task);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server error' });
    }
};
  
  // Toggle the task's done value
exports.toggleDone = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { done } = req.body;
  
      // Find the task by its ID and update the done value
      const task = await Task.findByIdAndUpdate(
        taskId,
        { done },
        { new: true }
      );
  
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).send(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
};
