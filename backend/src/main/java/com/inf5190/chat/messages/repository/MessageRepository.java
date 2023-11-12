package com.inf5190.chat.messages.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.inf5190.chat.messages.model.Message;
import com.inf5190.chat.messages.model.NewMessageRequest;

/**
 * Classe qui gère la persistence des messages.
 * 
 * En mémoire pour le moment.
 */
@Repository
public class MessageRepository {
    private final List<Message> messages = new ArrayList<Message>();

    private static final String COLLECTION_NAME = "messages";
    private final Firestore firestore = FirestoreClient.getFirestore();
    // Collection de userAccount
    final CollectionReference collectionRef = firestore.collection(
            COLLECTION_NAME);

    public List<Message> getMessages(String fromId) throws InterruptedException, ExecutionException {
        // Pour faire une requêtre, on utilise des Query
        // Ici, on ordonne par timestamp
        // Attention, chaque appel orderBy et limitToLast retourne une nouvelle Query!
        // Ce n'est pas un builder pattern qui modifie la query précédente.
        Query query = null;// lastTwoqueries

        if (fromId == null)
            query = collectionRef.orderBy("timestamp").limit(20);
        else {
            DocumentSnapshot doc3 = collectionRef.document(fromId).get().get();
            query = collectionRef.orderBy("timestamp").startAfter(doc3);
        }

        // Pour exécuter la query on applle get.
        ApiFuture<QuerySnapshot> entries = query.get();// lastTwoentries
        // On attend la complétion.
        QuerySnapshot querySnapshot = entries.get();

        // Conversion du resultat en object FirestoreMessage
        List<Message> result = new ArrayList<>();

        querySnapshot.forEach(document -> {
            String id = document.getId();
            FirestoreMessage m = document.toObject(FirestoreMessage.class);
            result.add(new Message(id, m.getUsername(), m.getTimestamp().getSeconds(), m.getText(), m.getimageUrl()));
        });
        // System.out.println(result);
        return result;
    }

    public NewMessageRequest createMessage(NewMessageRequest message) {
        FirestoreMessage firemsg = new FirestoreMessage(message.username(), Timestamp.now(), message.text(), null);
        try {
            firestore.collection(COLLECTION_NAME).document().create(firemsg);
        } catch (Exception e) {
            throw new UnsupportedOperationException(e);
        }

        return message;
    }

}
