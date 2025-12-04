const { db } = require("../../../core/config/firebase");
const User = require("../models/user");

class UserRepository {
  async save(userInstance) {
    if (!(userInstance instanceof User)) {
      throw new Error("O dado fornecido não é uma instância de User");
    }
    await db
      .collection("users")
      .doc(userInstance.uid)
      .set(userInstance.toFirestore());
    return userInstance;
  }

  async findByUid(uid) {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }
    return User.fromFirestore(userDoc.id, userDoc.data());
  }

  async findBySteamId(steamId) {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("steamId", "==", steamId).get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs[0].id;
  }

  async update(uid, data) {
    await db.collection("users").doc(uid).update(data);
  }
}

module.exports = new UserRepository();
