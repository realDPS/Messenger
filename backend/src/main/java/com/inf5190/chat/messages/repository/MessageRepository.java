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
        List<Message> result = new ArrayList<>();
        for (Message message : messages) {
            if (message.id() > fromId) {
                result.add(message);
            }
        }
        return result;

    }

    public Message createMessage(Message message) {
        // todo:Need to check content of arg message.
        Message m = new Message(idGenerator.incrementAndGet(), message.username(), message.timestamp(), message.text());
        messages.add(m);
        return m;
    }

}
