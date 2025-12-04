const { db } = require("../../../core/config/firebase");
const GameLog = require("../models/gamelog");

const gameLogCollection = db.collection("gameLogs");

class GameLogRepository {
  async save(gameLog) {
    const docRef = await gameLogCollection.add(gameLog.toFirestore());
    return docRef.id;
  }

  async findByUserAndGame(userId, gameId) {
    const snapshot = await gameLogCollection
      .where("userId", "==", userId)
      .where("gameId", "==", gameId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return GameLog.fromFirestore(doc.id, doc.data());
  }

  async countPlayingByGameId(gameId) {
    const snapshot = await gameLogCollection
      .where("gameId", "==", gameId)
      .where("status", "==", "Playing")
      .get();
    return snapshot.size;
  }

  async findByUser(userId) {
    const snapshot = await gameLogCollection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => GameLog.fromFirestore(doc.id, doc.data()));
  }

  async findById(id) {
    const doc = await gameLogCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return GameLog.fromFirestore(doc.id, doc.data());
  }

  async update(id, data) {
    await gameLogCollection.doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id) {
    await gameLogCollection.doc(id).delete();
  }
}

module.exports = new GameLogRepository();
