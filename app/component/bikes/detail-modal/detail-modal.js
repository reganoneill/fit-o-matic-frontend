'use strict';

require('./_detail-modal.scss');

module.exports = {
  template: require('./detail-modal.html'),
  controller: ['$log', 'profileService', DetailModalController],
  controllerAs: 'detailModalCtrl',
  bindings: {
    resolve: '<',
  }
};

function DetailModalController($log, profileService){
  $log.debug('DetailModalController');
  this.tempProfile = {};
  this.checkFavorite = function() {
    profileService.fetchProfile()
    .then( res => {
      this.tempProfile = res.data;
      res.data.geoID.forEach( favorite => {
        if(favorite === this.resolve.modalData._id){
          this.isFavorite=true;
        }
      });
    });
  };

  this.addFavorite = function() {
    $log.debug('DetailModalController.addFavorite');
    this.tempProfile.geoID.push(this.resolve.modalData._id);
    profileService.updateProfile(this.tempProfile._id, this.tempProfile);
    this.isFavorite = true;
  };

  this.removeFavorite = function(){
    this.tempProfile.geoID.forEach( (favorite, index) => {
      if(favorite === this.resolve.modalData._id){
        this.tempProfile.geoID.splice(index, 1);
      }
      profileService.updateProfile(this.tempProfile._id, this.tempProfile);
      this.isFavorite = false;
    });
  };

  this.$onInit = function(){
    if(this.resolve.modalData.geo) this.checkFavorite();
  };
}
