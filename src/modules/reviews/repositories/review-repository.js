const { db } = require("../../../core/config/firebase");
const Review = require("../models/review");

const reviewCollection = db.collection("reviews");

class ReviewRepository {
  async save(review) {
    // In reviews, we want one review per user per game. So we'll use a custom ID.
    const docId = `${review.userId}_${review.gameId}`;
    await reviewCollection.doc(docId).set(review.toFirestore());
    return docId;
  }

  async update(id, data) {
    await reviewCollection.doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async findByUserAndGame(userId, gameId) {
    const docId = `${userId}_${gameId}`;
    const doc = await reviewCollection.doc(docId).get();
    if (!doc.exists) {
      return null;
    }
    return Review.fromFirestore(doc.id, doc.data());
  }
  
  async findByUser(userId) {
    const snapshot = await reviewCollection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => Review.fromFirestore(doc.id, doc.data()));
  }

  async findByGame(gameId) {
    const snapshot = await reviewCollection.where("gameId", "==", gameId).get();
    return snapshot.docs.map((doc) => Review.fromFirestore(doc.id, doc.data()));
  }

  async countByGame(gameId) {
    const snapshot = await reviewCollection.where("gameId", "==", gameId).get();
    return snapshot.size;
  }

  async findRecentByGame(gameId, limit = 3) {
    const snapshot = await reviewCollection
      .where("gameId", "==", gameId)
      .orderBy("updatedAt", "desc")
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => Review.fromFirestore(doc.id, doc.data()));
  }

  async findById(id) {
    const doc = await reviewCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return Review.fromFirestore(doc.id, doc.data());
  }

  async delete(id) {
    await reviewCollection.doc(id).delete();
  }
}

module.exports = new ReviewRepository();
