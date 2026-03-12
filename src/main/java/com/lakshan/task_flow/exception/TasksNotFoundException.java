package com.lakshan.task_flow.exception;

public class TasksNotFoundException extends RuntimeException {

    public TasksNotFoundException(String message) {
        super(message);
    }
}
