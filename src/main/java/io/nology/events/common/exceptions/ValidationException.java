package io.nology.events.common.exceptions;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

public class ValidationException extends RestException{
    public ValidationException(Map<String, List<String>> errors) {
        super("Validation failed", HttpStatus.BAD_REQUEST, errors);
    }
}
