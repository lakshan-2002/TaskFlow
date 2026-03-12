package com.lakshan.task_flow.service;

import com.lakshan.task_flow.entity.Task;
import com.lakshan.task_flow.entity.User;
import com.lakshan.task_flow.enums.Role;
import com.lakshan.task_flow.exception.TasksNotFoundException;
import com.lakshan.task_flow.exception.UserNotFoundException;
import com.lakshan.task_flow.model.TaskRequest;
import com.lakshan.task_flow.repository.TaskRepository;
import com.lakshan.task_flow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private static final String ERROR_MESSAGE = "User not found with email: ";

    @Autowired
    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public void createNewTask(TaskRequest taskRequest, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(ERROR_MESSAGE + email));

        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setStatus(taskRequest.getStatus());
        task.setPriority(taskRequest.getPriority());
        task.setDueDate(taskRequest.getDueDate());
        task.setUser(user);
        taskRepository.save(task);
    }

    public List<Task> getTasksByUserEmail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(ERROR_MESSAGE + email));

        if(user.getRole() == Role.ADMIN)
            return taskRepository.findAll();

        return taskRepository.findByUserId(user.getId());
    }

    public void updateTask(TaskRequest taskRequest, String email){
        if(taskRepository.existsById(taskRequest.getId())){
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UserNotFoundException(ERROR_MESSAGE + email));

            Task task = taskRepository.findByIdAndUserId(taskRequest.getId(), user.getId())
                    .orElseThrow(() -> new TasksNotFoundException("Task not found for user with email: " + email));

            task.setTitle(taskRequest.getTitle());
            task.setDescription(taskRequest.getDescription());
            task.setStatus(taskRequest.getStatus());
            task.setPriority(taskRequest.getPriority());
            task.setDueDate(taskRequest.getDueDate());
            task.setUser(user);
            taskRepository.save(task);
        }
        else
            throw new TasksNotFoundException("Task not found with id: " + taskRequest.getId());
    }

    public void deleteTask(int id, String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(ERROR_MESSAGE + email));

        Task task = taskRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new TasksNotFoundException("Task not found for the user with email: " + email));

        taskRepository.delete(task);

    }
}
