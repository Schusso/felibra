import {Component, OnInit, Input} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() file: File;

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // Downaload URL
  downloadURL;

  // State for Dropzone CSS toggling
  isHovering: boolean;


  constructor(private storage: AngularFireStorage, private db: AngularFirestore) {
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  ngOnInit(): void {
    this.startUpload();
  }

  startUpload() {
    // The storage path
    const path = `test/$(new Date().getTime()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);
    // Totally optional metadata
    const customMetadata = {app: 'My AngularFire-powered'};

    // The main task
    this.task = this.storage.upload(path, this.file, {customMetadata});

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(tap(console.log),
      finalize( async() => {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.db.collection('files').add({downloadURL: this.downloadURL, path});
      } ),
      );


  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return snapshot.state === 'running'
      && snapshot.bytesTransferred < snapshot.totalBytes;
  }
}
