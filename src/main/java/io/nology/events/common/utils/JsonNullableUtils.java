package io.nology.events.common.utils;

import java.util.function.Consumer;
import java.util.function.Function;

import org.openapitools.jackson.nullable.JsonNullable;

public final class JsonNullableUtils {
    private JsonNullableUtils() {

    }

    public static <T> void update(JsonNullable<T> value, Consumer<T> setter) {
        if(value != null && value.isPresent()) {
            setter.accept(value.orElse(null));
        }
    }

    public static <T> void update(JsonNullable<T> value, Function<T, T> sanitizer, Consumer<T> setter) {
        if(value != null && value.isPresent()) {
            setter.accept(sanitizer.apply(value.orElse(null)));
        }
    }

    public static <T> void updateNonNull(JsonNullable<T> value, Consumer<T> setter) {
        if(value != null && value.isPresent() && value.get() != null) {
            setter.accept(value.get());
        }
    }
}
