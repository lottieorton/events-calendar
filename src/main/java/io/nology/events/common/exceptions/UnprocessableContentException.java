package io.nology.events.common.exceptions;

import org.springframework.http.HttpStatus;

public class UnprocessableContentException extends RestException {
    public UnprocessableContentException(String message) {
        super(message, HttpStatus.UNPROCESSABLE_CONTENT);
    }
}
