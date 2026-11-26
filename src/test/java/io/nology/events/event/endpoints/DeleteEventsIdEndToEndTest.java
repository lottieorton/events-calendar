package io.nology.events.event.endpoints;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import io.nology.events.config.BaseEndToEndTest;
import io.nology.events.event.entities.Event;
import io.nology.events.event.factory.EventTestFactory;
import io.nology.events.event.factory.EventTestFactoryOptions;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.equalTo;

public class DeleteEventsIdEndToEndTest extends BaseEndToEndTest {
    private final EventTestFactory factory;

    @Autowired
    public DeleteEventsIdEndToEndTest(EventTestFactory factory) {
        this.factory = factory;
    }

    @Test 
    public void deleteById_EventInDB_ReturnsNoContent() {
        var opts = EventTestFactoryOptions.builder().build();
        Event event = factory.create(opts);

        given().when().delete("/events/" + event.getId())
        .then().statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test 
    public void deleteById_IdNotInDB_ReturnsNotFound() {
         given().when().delete("/events/1")
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find event with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteById_InvalidIdType_ReturnsBadRequest() {
         given().when().delete("/events/a")
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }
}
