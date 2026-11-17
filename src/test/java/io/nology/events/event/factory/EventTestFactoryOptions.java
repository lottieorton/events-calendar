package io.nology.events.event.factory;

import java.time.Instant;

import io.nology.events.calendar.entities.Calendar;

public class EventTestFactoryOptions {
    
    String title;
    String description;
    Calendar calendar;
    Instant startAt;
    Instant endAt;
    Boolean isAllDay;
    Instant createdAt;

    public EventTestFactoryOptions(Builder builder) {
        this.title = builder.title;
        this.description = builder.description;
        this.calendar = builder.calendar;
        this.startAt = builder.startAt;
        this.endAt = builder.endAt;
        this.isAllDay = builder.isAllDay;
        this.createdAt = builder.createdAt;
    }
    
    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String title;
        private String description;
        private Calendar calendar;
        private Instant startAt;
        private Instant endAt;
        private Boolean isAllDay;
        private Instant createdAt;

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder calendar(Calendar calendar) {
            this.calendar = calendar;
            return this;
        }

        public Builder startAt(Instant startAt) {
            this.startAt = startAt;
            return this;
        }

        public Builder endAt(Instant endAt) {
            this.endAt = endAt;
            return this;
        }

        public Builder isAllDay(Boolean isAllDay) {
            this.isAllDay = isAllDay;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public EventTestFactoryOptions build() {
            return new EventTestFactoryOptions(this);
        }
    }
}
