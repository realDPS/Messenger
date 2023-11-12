package com.inf5190.chat.auth.session;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Repository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

/**
 * Classe qui gère les sessions utilisateur.
 * 
 * Pour le moment, on gère en mémoire.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();

    SecretKey key = Jwts.SIG.HS256.key().build();
    String secretString = Encoders.BASE64.encode(key.getEncoded());
    private final String SECRET_KEY_BASE64 = secretString;
    private final SecretKey secretKey;
    private final JwtParser jwtParser;

    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parser().verifyWith(this.secretKey).build();
    }

    public String addSession(SessionData authData) {

        String jwt = Jwts.builder()
                .subject(authData.username())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000))
                .signWith(this.secretKey)
                .compact();

        this.sessions.put(jwt, authData);
        return jwt;
    }

    public void removeSession(String sessionId) {
        this.sessions.remove(sessionId);
    }

    public SessionData getSession(String sessionId) {

        try {
            Jws<Claims> signedClaims = jwtParser.parseSignedClaims(sessionId);
            Claims claims = signedClaims.getPayload();
            String username = claims.getSubject();
            if (sessions.containsKey(sessionId)) {
                return new SessionData(username);
            }
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
        return null;
    }
}
