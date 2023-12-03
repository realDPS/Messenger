package com.inf5190.chat.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.concurrent.ExecutionException;

public class TestAuthController {
    private final String username = "username";
    private final String password = "pwd";
    private final String hashedPassword = "hash";
    private final FirestoreUserAccount userAccount = new FirestoreUserAccount(this.username,
            this.hashedPassword);

    private final LoginRequest loginRequest = new LoginRequest(this.username, this.password);

    @Mock
    private SessionManager mockSessionManager;

    @Mock
    private UserAccountRepository mockAccountRepository;

    @Mock
    private PasswordEncoder mockPasswordEncoder;

    private AuthController authController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        this.authController = new AuthController(mockSessionManager, mockAccountRepository, mockPasswordEncoder);
    }

    @Test
    public void loginExistingUserAccountWithCorrectPassword() throws InterruptedException, ExecutionException {
        final SessionData expectedSessionData = new SessionData(this.username);
        final String expectedUsername = this.username;

        when(this.mockAccountRepository.getUserAccount(loginRequest.username())).thenReturn(userAccount);
        when(this.mockPasswordEncoder.matches(loginRequest.password(), this.hashedPassword)).thenReturn(true);
        when(this.mockSessionManager.addSession(expectedSessionData)).thenReturn(expectedUsername);

        ResponseEntity<LoginResponse> response = this.authController.login(loginRequest);
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().username()).isEqualTo(expectedUsername);

        verify(this.mockAccountRepository, times(1)).getUserAccount(this.username);
        verify(this.mockPasswordEncoder, times(1)).matches(this.password, this.hashedPassword);
        verify(this.mockSessionManager, times(1)).addSession(expectedSessionData);
    }

    @Test
    public void loginNonExistingUserAccount() throws InterruptedException, ExecutionException {
        final SessionData expectedSessionData = new SessionData(this.username);
        final String expectedUsername = this.username;

        when(this.mockAccountRepository.getUserAccount(loginRequest.username())).thenReturn(null);
        when(this.mockPasswordEncoder.encode(loginRequest.password())).thenReturn("newHash");
        when(this.mockSessionManager.addSession(expectedSessionData)).thenReturn(expectedUsername);

        ResponseEntity<LoginResponse> response = this.authController.login(loginRequest);
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().username()).isEqualTo(expectedUsername);

        verify(this.mockAccountRepository, times(1)).createUserAccount(any(FirestoreUserAccount.class));
        verify(this.mockSessionManager, times(1)).addSession(eq(expectedSessionData));
    }

    @Test
    public void loginExistingUserWithIncorrectPassword() throws InterruptedException, ExecutionException {
        final String existingUsername = "existingUser";
        final String incorrectPassword = "incorrectPassword";

        when(this.mockAccountRepository.getUserAccount(existingUsername))
                .thenReturn(new FirestoreUserAccount(existingUsername, "correctHashedPassword"));
        when(this.mockPasswordEncoder.matches(incorrectPassword, "correctHashedPassword")).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> this.authController.login(new LoginRequest(existingUsername, incorrectPassword)));
        assertThat(exception.getStatus().value()).isEqualTo(403);

        verify(this.mockAccountRepository, times(1)).getUserAccount(existingUsername);
        verify(this.mockPasswordEncoder, times(1)).matches(incorrectPassword, "correctHashedPassword");
        verify(this.mockSessionManager, never()).addSession(any(SessionData.class));
    }

    @Test
    public void loginUnexpectedException() throws InterruptedException, ExecutionException {
        final String existingUsername = "existingUser";
        final String correctPassword = "correctPassword";

        when(this.mockAccountRepository.getUserAccount(existingUsername))
                .thenThrow(new RuntimeException("Simulated unexpected exception"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> this.authController.login(new LoginRequest(existingUsername, correctPassword)));
        assertThat(exception.getMessage()).isEqualTo("Simulated unexpected exception");

        verify(this.mockAccountRepository, times(1)).getUserAccount(existingUsername);
        verify(this.mockPasswordEncoder, never()).matches(anyString(), anyString());
        verify(this.mockSessionManager, never()).addSession(any(SessionData.class));
    }
}