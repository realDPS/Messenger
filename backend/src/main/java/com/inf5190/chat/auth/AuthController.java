package com.inf5190.chat.auth;

import java.time.Duration;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;

/**
 * Contrôleur qui gère l'API de login et logout.
 */
@RestController()
public class AuthController {
    public static final String AUTH_LOGIN_PATH = "/auth/login";
    public static final String AUTH_LOGOUT_PATH = "/auth/logout";
    public static final String SESSION_ID_COOKIE_NAME = "sid";

    private final SessionManager sessionManager;

    public AuthController(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @PostMapping(AUTH_LOGIN_PATH)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        // Creation d'un nouveau objet sessionData.
        SessionData sessionData = new SessionData(loginRequest.username());
        // Ajout de la session dans sessionManager.
        String sessionId = sessionManager.addSession(sessionData);
        // Construit le cookie à partir de sessionId.
        ResponseCookie cookie = ResponseCookie.from(SESSION_ID_COOKIE_NAME, sessionId)
                .secure(true)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofHours(24))
                .build();
        // Crée un loginResponse à partir du username.
        LoginResponse loginResponse = new LoginResponse(loginRequest.username());
        // Construit ResponseEntity avec le cookie et le loginResponse.
        ResponseEntity<LoginResponse> responseEntity = ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(loginResponse);
        return responseEntity;
    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<Void> logout(@CookieValue("sid") Cookie sessionCookie) {
        sessionCookie.setMaxAge(0);
        sessionManager.removeSession(sessionCookie.getName());
        return ResponseEntity.ok().build();// todo:check
    }
}
