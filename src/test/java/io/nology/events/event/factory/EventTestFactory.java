package io.nology.events.event.factory;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.github.javafaker.Faker;

import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.factory.CalendarTestFactory;
import io.nology.events.event.EventRepository;
import io.nology.events.event.entities.Event;

@Component
@Profile("test")
public class EventTestFactory {
    private final EventRepository repo;
    private final Faker faker;
    private final CalendarTestFactory calendarFactory;
   
    public EventTestFactory(EventRepository repo, Faker faker, CalendarTestFactory calendarFactory) {
        this.repo = repo;
        this.faker = faker;
        this.calendarFactory = calendarFactory;
    }

    public long count() {
        return this.repo.count();
    }

    public Event build(EventTestFactoryOptions opts) {
        String title = opts.title != null ? opts.title : faker.lorem().sentence(3);
        String description = opts.description != null ? opts.description : faker.lorem().paragraph(2);
        Calendar calendar = opts.calendar != null ? opts.calendar : calendarFactory.create();
        Instant startAt = opts.startAt != null ? opts.startAt : faker.date().future(30, TimeUnit.DAYS).toInstant();
        Instant endAt = opts.endAt != null ? opts.endAt : faker.date().between(Date.from(startAt), Date.from(startAt.plus(7, ChronoUnit.DAYS))).toInstant();
        Boolean isAllDay = opts.isAllDay != null ? opts.isAllDay : false;
        Instant createdAt = resolveCreatedAt(opts, startAt);
        Event newEvent = new Event(title, description, calendar, startAt, endAt, isAllDay, createdAt);
        return newEvent;
    }

    public Event build() {
        var emptyOpts = EventTestFactoryOptions.builder().build();
        return build(emptyOpts);
    }

    public Event create(EventTestFactoryOptions opts) {
        var event = build(opts);
        return this.repo.saveAndFlush(event);
    }

    public Event create() {
        var emptyOpts = EventTestFactoryOptions.builder().build();
        return create(emptyOpts);
    }

    public Event create(Calendar calendar) {
        var opts = EventTestFactoryOptions.builder().calendar(calendar).build();
        return create(opts);
    }

    public List<Event> create(EventTestFactoryOptions opts, int n) {
        List<Event> events = new ArrayList<>();
        for(int i = 0; i < n; i++) {
            Event created = create(opts);
            events.add(created);
        }
        return events;
    }

    public List<Event> create(int n) {
        var emptyOpts = EventTestFactoryOptions.builder().build();
        return create(emptyOpts, n);
    }

    public Instant resolveCreatedAt(EventTestFactoryOptions opts, Instant startAt) {
        if(opts.createdAt != null) {
            return opts.createdAt;
        }

        return startAt.minus(Duration.ofDays(faker.number().numberBetween(1, 14)));
    }
}
