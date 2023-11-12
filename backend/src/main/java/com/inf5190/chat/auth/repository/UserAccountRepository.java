package com.inf5190.chat.auth.repository;

import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Repository;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;

@Repository
public class UserAccountRepository {
    private static final String COLLECTION_NAME = "userAccounts";
    private final Firestore firestore = FirestoreClient.getFirestore();
    // Collection de userAccount
    final CollectionReference collectionRef = firestore.collection(
            COLLECTION_NAME);

    public FirestoreUserAccount getUserAccount(String username) throws InterruptedException, ExecutionException {
        // document avec :username
        final DocumentReference docRef = collectionRef.document(username);
        return docRef.get().get().toObject(FirestoreUserAccount.class);

    }

    public void setUserAccount(FirestoreUserAccount userAccount) throws InterruptedException, ExecutionException {
        try {
            // Add userAccount
            firestore.collection(COLLECTION_NAME).document().create(userAccount);
        } catch (Exception e) {
            throw new UnsupportedOperationException(e);
        }
    }
}
