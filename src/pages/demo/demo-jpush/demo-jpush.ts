import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { JPush } from "@jiguang-ionic/jpush";
import { Device } from "@ionic-native/device";



@Component({
  selector: 'page-demo-jpush',
  templateUrl: 'demo-jpush.html',
})
export class DemoJpushPage {

  public registrationId: string;

  devicePlatform: string;
  sequence: number = 0;

  tagResultHandler = function (result) {
    var sequence: number = result.sequence;
    var tags: Array<string> = result.tags == null ? [] : result.tags;
    alert(
      "Success!" + "\nSequence: " + sequence + "\nTags: " + tags.toString()
    );
  };

  aliasResultHandler = function (result) {
    var sequence: number = result.sequence;
    var alias: string = result.alias;
    alert("Success!" + "\nSequence: " + sequence + "\nAlias: " + alias);
  };

  errorHandler = function (err) {
    var sequence: number = err.sequence;
    var code = err.code;
    alert("Error!" + "\nSequence: " + sequence + "\nCode: " + code);
  };

  constructor(
    public navCtrl: NavController,
    public jpush: JPush,
    device: Device
  ) {
    this.devicePlatform = device.platform;
  }

  getRegistrationID() {
    this.jpush.getRegistrationID().then(rId => {
      this.registrationId = rId;
    });
  }

  setTags() {
    this.jpush
      .setTags({ sequence: this.sequence++, tags: ["Tag1", "Tag2"] })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  addTags() {
    this.jpush
      .addTags({ sequence: this.sequence++, tags: ["Tag3", "Tag4"] })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  checkTagBindState() {
    this.jpush
      .checkTagBindState({ sequence: this.sequence++, tag: "Tag1" })
      .then(result => {
        var sequence = result.sequence;
        var tag = result.tag;
        var isBind = result.isBind;
        alert(
          "Sequence: " + sequence + "\nTag: " + tag + "\nIsBind: " + isBind
        );
      })
      .catch(this.errorHandler);
  }

  deleteTags() {
    this.jpush
      .deleteTags({ sequence: this.sequence++, tags: ["Tag4"] })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  getAllTags() {
    this.jpush
      .getAllTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  cleanTags() {
    this.jpush
      .cleanTags({ sequence: this.sequence++ })
      .then(this.tagResultHandler)
      .catch(this.errorHandler);
  }

  setAlias() {
    this.jpush
      .setAlias({ sequence: this.sequence++, alias: "TestAlias" })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  getAlias() {
    this.jpush
      .getAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  deleteAlias() {
    this.jpush
      .deleteAlias({ sequence: this.sequence++ })
      .then(this.aliasResultHandler)
      .catch(this.errorHandler);
  }

  addLocalNotification() {
    if (this.devicePlatform == "Android") {
      this.jpush.addLocalNotification(0, "Hello JPush", "JPush", 1, 5000);
    } else {
      this.jpush.addLocalNotificationForIOS(5, "Hello JPush", 1, "localNoti1");
    }
  }

}
