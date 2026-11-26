package io.nology.events.common.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.openapitools.jackson.nullable.JsonNullable;

public class JsonNullableUtilsTest {
    
    @Test 
    void update_withValue_appliesValue() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.update(JsonNullable.of("New value"), result::set);

        assertThat(result.get()).isEqualTo("New value");
    }
    
    @Test 
    void update_withUndefined_doesNotApplyValue() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.update(JsonNullable.undefined(), result::set);

        assertThat(result.get()).isEqualTo("Old value");
    }

    @Test 
    void update_withExplicitNull_appliesNull() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.update(JsonNullable.of(null), result::set);

        assertThat(result.get()).isNull();
    }

    @Test 
    void update_withSanitizer_appliesSanitizedValue() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.update(JsonNullable.of("  "), TextUtils::blankToNull, result::set);

        assertThat(result.get()).isNull();
    }

    @Test 
    void update_withUndefinedAndSanitizer_doesNotApplySanitizer() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.update(JsonNullable.undefined(), TextUtils::blankToNull, result::set);

        assertThat(result.get()).isEqualTo("Old value");
    }

    @Test 
    void update_withExplicitNullAndSanitizer_appliesSanitizer() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.update(JsonNullable.of(null), TextUtils::blankToNull, result::set);

        assertThat(result.get()).isNull();
    }

    @Test 
    void updateNotNull_withValue_appliesValue() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.updateNonNull(JsonNullable.of("New value"), result::set);

        assertThat(result.get()).isEqualTo("New value");
    }

    @Test 
    void updateNotNull_withUndefined_doesNotApplyValue() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.updateNonNull(JsonNullable.undefined(), result::set);

        assertThat(result.get()).isEqualTo("Old value");
    }

    @Test 
    void updateNotNull_withExplicitNull_doesNotApplyValue() {
        AtomicReference<String> result = new AtomicReference<>("Old value");

        JsonNullableUtils.updateNonNull(JsonNullable.of(null), result::set);

        assertThat(result.get()).isEqualTo("Old value");
    }
}


