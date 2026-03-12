package com.lakshan.task_flow.controller;

import com.lakshan.task_flow.entity.Task;
import com.lakshan.task_flow.model.TaskRequest;
import com.lakshan.task_flow.model.TaskResponse;
import com.lakshan.task_flow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest taskRequest,
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

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    public List<Task> getTasksByUserEmail(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        return taskService.getTasksByUserEmail(email);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping
    public ResponseEntity<TaskResponse> updateTask(
            @Valid @RequestBody TaskRequest taskRequest,
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

    @PreAuthorize("hasRole('USER')")
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
