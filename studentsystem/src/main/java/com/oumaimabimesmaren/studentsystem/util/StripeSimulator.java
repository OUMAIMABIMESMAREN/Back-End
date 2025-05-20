package com.oumaimabimesmaren.studentsystem.util;

import java.util.UUID;

public class StripeSimulator {
    public static String charge(double amount, String currency, String sourceToken) {
        // Just return a fake transaction ID
        return "ch_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
}
