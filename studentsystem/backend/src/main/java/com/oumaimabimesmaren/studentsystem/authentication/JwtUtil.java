package com.oumaimabimesmaren.studentsystem.authentication;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    private final String SECRET = "mysecretkeymysecretkeymysecretkeymysecretkey"; // 256-bit minimum
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    private Key getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // ✅ NEW: Generate token with role
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .addClaims(Map.of("role", "ROLE_" + role)) // Add role claim
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ NEW: Extract role from token
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getKey()).build().parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (JwtException e) {
            logger.error("Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
