package com.bkauto.web.common.authentication;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Comparator;
import java.util.List;

@Service
public class AuthService {

    @Value(value = "${authentication.session.max:5}")
    private int maxSession;

    private final AuthenticationManager authenticationManager;
    private final SessionRegistry sessionRegistry;


    public AuthService(AuthenticationManager authenticationManager, SessionRegistry sessionRegistry) {
        this.authenticationManager = authenticationManager;
        this.sessionRegistry = sessionRegistry;
    }

    public AuthenticationResponse login(AuthenticationRequest loginRequest, HttpServletRequest servletRequest) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(), loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(token);

        User user = (User) authentication.getPrincipal();
        validateMaxSession(user);

        sessionRegistry.registerNewSession(servletRequest.getSession().getId(), authentication.getPrincipal());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        AuthenticationResponse response = new AuthenticationResponse();
        response.setUserName(user.getUsername());

        return response;
    }

    private void validateMaxSession(UserDetails principal) {
        if (maxSession <= 0) {
            return;
        }

        List<SessionInformation> sessions = this.sessionRegistry.getAllSessions(principal, false);

        if (sessions.size() >= maxSession) {
            sessions.stream()
                    .min(Comparator.comparing(SessionInformation::getLastRequest)) // Get the oldest session
                    .ifPresent(sessionInfo -> {
                        String sessionID = sessionInfo.getSessionId();
                        this.sessionRegistry.removeSessionInformation(sessionID);
                    });
        }
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }

}