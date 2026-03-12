package com.lakshan.task_flow.controller;

import com.lakshan.task_flow.entity.Task;
import com.lakshan.task_flow.model.TaskRequest;
import com.lakshan.task_flow.model.TaskResponse;
import com.lakshan.task_flow.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @RequestBody TaskRequest taskRequest,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();

        taskService.createNewTask(taskRequest, email);

        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setTitle(taskRequest.getTitle());
        taskResponse.setDescription(taskRequest.getDescription());
        taskResponse.setStatus(taskRequest.getStatus());
        taskResponse.setPriority(taskRequest.getPriority());
        taskResponse.setDueDate(taskRequest.getDueDate());

        return ResponseEntity.status(201).body(taskResponse);
    }

    @GetMapping
    public List<Task> getTasksByUserEmail(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        return taskService.getTasksByUserEmail(email);
    }

    @PutMapping
    public ResponseEntity<TaskResponse> updateTask(
            @RequestBody TaskRequest taskRequest,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();

        taskService.updateTask(taskRequest, email);

        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setTitle(taskRequest.getTitle());
        taskResponse.setDescription(taskRequest.getDescription());
        taskResponse.setStatus(taskRequest.getStatus());
        taskResponse.setPriority(taskRequest.getPriority());
        taskResponse.setDueDate(taskRequest.getDueDate());

        return ResponseEntity.ok(taskResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable int id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String email = userDetails.getUsername();

        taskService.deleteTask(id, email);
        return ResponseEntity.ok("Task deleted successfully.");

    }
}
