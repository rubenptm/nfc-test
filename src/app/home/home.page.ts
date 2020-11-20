import { Component, ChangeDetectorRef } from '@angular/core';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  subscription: any;

  constructor(private nfc: NFC, private ndef: Ndef,
    private cdr:ChangeDetectorRef) { }

  showSettings() {
    this.nfc.showSettings().then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }

  checkEnabled() {
    this.nfc.enabled().then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }

  readNdef() {
    this.subscription = this.nfc.addNdefListener(() => {
      console.log('Listener started')
    }, err => {
      console.log(err);
    }).subscribe( async (event) => {
      console.log(2);
      await console.log(event);
      await console.log(event.tag);
      await console.log(event.tag.id);
      await console.log(this.nfc.bytesToHexString(event.tag.id));
      if(event.tag.ndefMessage) {
        await console.log(event.tag.ndefMessage[0].payload);
        await console.log(this.nfc.bytesToHexString(event.tag.ndefMessage[0].payload));
      }
    });
    this.cdr.detectChanges();
  }

  removeNdef() {
    this.subscription.unsubscribe();
    this.cdr.detectChanges();
  }

  readNTag() {
    this.subscription = this.nfc.addTagDiscoveredListener(() => {
      console.log('Listener started');
    }, err => {
      console.log(err);
    }).subscribe( async (event) => {
      console.log(1);
      await console.log(event);
      await console.log(event.tag);
      await console.log(event.tag.id);
      await console.log(this.nfc.bytesToHexString(event.tag.id));
      if(event.tag.ndefMessage) {
        await console.log(event.tag.ndefMessage[0].payload);
        await console.log(this.nfc.bytesToHexString(event.tag.ndefMessage[0].payload));
      }
    });
    this.cdr.detectChanges();    
  }

  removeNTag() {
    this.subscription.unsubscribe();
    this.cdr.detectChanges();
  }

  writeToTag() {
    let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
    this.subscription = this.nfc.readerMode(flags).subscribe(
        tag => {
          console.log(JSON.stringify(tag));
          console.log(this.nfc.bytesToHexString(tag.id));
        },
        err => console.log('Error reading tag', err)
    );
    this.cdr.detectChanges();
  }

  shareMessage() {
    var message = [this.ndef.textRecord('hello world')];
    this.nfc.share(message).then(res => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  unShareMessage() {
    this.nfc.unshare().then(res => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  eraseTag() {

  }

  startSession() {
    // Promise
    this.nfc.scanNdef().then(
      tag => console.log(JSON.stringify(tag)),
      err => console.log(err)
    );    
  }

  startSessionTag() {
    // Promise
    this.nfc.scanTag().then(
      tag => {
          console.log(JSON.stringify(tag))
          if (tag.id) {
              console.log(this.nfc.bytesToHexString(tag.id));
          }            
      },
      err => console.log(err)
    );
  }

  endSession() {
    this.nfc.cancelScan();
  }

}
