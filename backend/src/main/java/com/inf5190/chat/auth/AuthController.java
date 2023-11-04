package com.inf5190.chat.auth;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
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
    private final UserAccountRepository userRepo = new UserAccountRepository();

    public AuthController(SessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @PostMapping(AUTH_LOGIN_PATH)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest)
            throws InterruptedException, ExecutionException {

        // Creation d'un nouveau objet sessionData.
        SessionData sessionData = new SessionData(loginRequest.username());
        // Ajout de la session dans sessionManager.
        String sessionId = sessionManager.addSession(sessionData);

        FirestoreUserAccount user = userRepo.getUserAccount(loginRequest.username());

        if (user == null) {
            user = new FirestoreUserAccount(loginRequest.username(), loginRequest.password());// todo:need to be encoded
            userRepo.setUserAccount(user);
        }

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
    public ResponseEntity<Void> logout(@CookieValue("sid") Cookie sessionCookie, HttpServletResponse response) {

        String sessionId = sessionCookie.getValue();

        // Enlève la session du sessionManger.
        sessionManager.removeSession(sessionId);

        // setMaxAge 0 pour que le cookie expire.
        sessionCookie.setMaxAge(0);

        // Ajoute le nouveau cookie à la réponse
        response.addCookie(sessionCookie);

        return ResponseEntity.ok().build();
    }
}
