package io.nology.events.common.utils;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

public class TextUtilsTests {
    @Test 
    void blankToNull_returnsString_whenInputIsNonBlankString() {
        assertThat(TextUtils.blankToNull("Hello")).isEqualTo("Hello");
    }

    @Test 
    void blankToNull_returnsNull_whenInputIsBlankString() {
        assertThat(TextUtils.blankToNull(" ")).isNull();
    }
    
    @Test 
    void blankToNull_returnsNull_whenInputIsEmptyString() {
        assertThat(TextUtils.blankToNull("")).isNull();
    }

    @Test 
    void blankToNull_returnsNull_whenInputIsNull() {
        assertThat(TextUtils.blankToNull(null)).isNull();
    }

}
