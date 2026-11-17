package io.nology.events.event.endpoints;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.factory.CalendarTestFactory;
import io.nology.events.calendar.factory.CalendarTestFactoryOptions;
import io.nology.events.config.BaseEndToEndTest;
import io.nology.events.event.entities.Event;
import io.nology.events.event.factory.EventTestFactory;
import io.nology.events.event.factory.EventTestFactoryOptions;

@DisplayName("GET /events")
public class GetEventsEndToEndTest extends BaseEndToEndTest {
    private final EventTestFactory factory;
    private final CalendarTestFactory calendarFactory;

    @Autowired
    public GetEventsEndToEndTest(EventTestFactory factory, CalendarTestFactory calendarFactory) {
        this.factory = factory;
        this.calendarFactory = calendarFactory;
    }

    @Test 
    public void getAllEvents_EventsInDB_ReturnsOKAndListOfEvents() {
        Calendar testCalendar = calendarFactory.create(CalendarTestFactoryOptions.builder().name("Example").build());
        var opts = EventTestFactoryOptions.builder().title("Test title").calendar(testCalendar).build();
        List<Event> events = factory.create(opts, 5);

        given().get("/events")
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(5))
        .body("title[0]", equalTo(events.get(0).getTitle()))
        .body("calendar.name[0]", equalTo(testCalendar.getName()))
        .body(matchesJsonSchemaInClasspath("schemas/event-list-schema.json"));
    }

    @Test 
    public void getAllEvents_NoEvents_ReturnsOKAndEmptyList() {
        given().get("/events")
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }
}
