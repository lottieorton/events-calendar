package io.nology.events.common.exceptions;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

public abstract class RestException extends RuntimeException {
    private final HttpStatus status;

    private final Map<String, List<String>> errors;

    public RestException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.errors = null;
    }

    public RestException(String message, HttpStatus status, Map<String, List<String>> errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Map<String, List<String>> getErrors() {
        return errors;
    }
    
}
