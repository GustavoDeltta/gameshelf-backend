class ReviewViewModel {
  constructor({
    appid,
    gameName,
    profilePicture,
    profileName,
    log,
    hoursPlayed,
    reviewScore,
    reviewComment,
    reviewDate,
    liked,
  }) {
    this.appid = appid;
    this.gameName = gameName;
    this.profilePicture = profilePicture;
    this.profileName = profileName;
    this.log = log;
    this.hoursPlayed = hoursPlayed;
    this.reviewScore = reviewScore;
    this.reviewComment = reviewComment;
    this.reviewDate = reviewDate;
    this.liked = liked;
  }
}

module.exports = ReviewViewModel;
