package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import com.inf5190.chat.messages.model.Message;

import org.springframework.stereotype.Repository;

/**
 * Classe qui gère la persistence des messages.
 * 
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {
    private final List<Message> messages = new ArrayList<Message>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public List<Message> getMessages(Long fromId) {
        // Retourne une liste de tout les messages.
        return new ArrayList<>(messages);
    }

    public Message createMessage(Message message) {
        // Genère un Id des messages.
        long messageId = idGenerator.incrementAndGet();

        // Crée un nouveau messsage avec ce Id.
        Message newMessage = new Message(messageId, message.username(), System.currentTimeMillis(), message.text());

        // Ajoute le message à la liste.
        messages.add(newMessage);

        return newMessage;
    }

}
