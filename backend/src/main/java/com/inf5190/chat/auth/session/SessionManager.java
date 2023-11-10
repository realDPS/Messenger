package com.inf5190.chat.auth.session;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Repository;

import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Classe qui gère les sessions utilisateur.
 * 
 * Pour le moment, on gère en mémoire.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();
    private static final String SECRET_KEY_BASE64 = "<VOTRE CLÉ SECRÈTE>";
    private final SecretKey secretKey;
    private final JwtParser jwtParser;

    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parser().verifyWith(this.secretKey).build();
    }

    public String addSession(SessionData authData) {
        final String sessionId = this.generateSessionId();
        this.sessions.put(sessionId, authData);
        return sessionId;
    }

    public void removeSession(String sessionId) {
        this.sessions.remove(sessionId);
    }

    public SessionData getSession(String sessionId) {
        return this.sessions.get(sessionId);
    }

    private String generateSessionId() {
        return UUID.randomUUID().toString();
    }

}
