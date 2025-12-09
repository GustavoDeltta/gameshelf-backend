const { db } = require("../../../core/config/firebase");
const Gamelist = require("../models/gamelist");

const gameListsCollection = db.collection("gameLists");

class GamelistRepository {
  async save(gameList) {
    const docRef = await gameListsCollection.add(gameList.toFirestore());
    return docRef.id;
  }

  async findByUser(userId) {
    const snapshot = await gameListsCollection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => Gamelist.fromFirestore(doc.id, doc.data()));
  }

  async findById(id) {
    const doc = await gameListsCollection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return Gamelist.fromFirestore(doc.id, doc.data());
  }

  async update(id, data) {
    await gameListsCollection.doc(id).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id) {
    await gameListsCollection.doc(id).delete();
  }

  async findByGameId(gameId, limit = null) {
    let query = gameListsCollection.where("games", "array-contains", gameId).orderBy("updatedAt", "desc");

    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => Gamelist.fromFirestore(doc.id, doc.data()));
  }
}

module.exports = new GamelistRepository();