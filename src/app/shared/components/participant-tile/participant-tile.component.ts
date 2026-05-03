import {
  Component, Input, OnInit, OnDestroy,
  ViewChild, ElementRef, OnChanges
} from '@angular/core';
import {
  Participant, Track, LocalParticipant, RemoteParticipant
} from 'livekit-client';

@Component({
  selector: 'app-participant-tile',
  template: `
    <div class="tile" [class.local]="isLocal">

      <!-- Video -->
      <video #videoEl autoplay playsinline
        [muted]="isLocal">
      </video>

      <!-- Avatar shown when camera is off -->
      @if (!cameraEnabled) {
        <div class="avatar">
          {{ participant.identity[0]?.toUpperCase() }}
        </div>
      }

      <!-- Name badge -->
      <div class="name-badge">
        <span>{{ participant.identity }}</span>
        @if (!micEnabled) {
          <span>🔇</span>
        }
        @if (isLocal) {
          <span> (You)</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .tile { position: relative; background: #1a1a2e; border-radius: 12px;
            overflow: hidden; aspect-ratio: 16/9; }
    video  { width: 100%; height: 100%; object-fit: cover; }
    .avatar { position: absolute; inset: 0; display: flex;
              align-items: center; justify-content: center;
              font-size: 3rem; color: white; background: #2d2d44; }
    .name-badge { position: absolute; bottom: 8px; left: 8px;
                  background: rgba(0,0,0,0.6); color: white;
                  padding: 4px 8px; border-radius: 6px; font-size: 0.85rem; }
  `]
})
export class ParticipantTileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() participant!: Participant;
  @ViewChild('videoEl', { static: true }) videoEl!: ElementRef<HTMLVideoElement>;

  cameraEnabled = false;
  micEnabled = false;

  get isLocal() {
    return this.participant instanceof LocalParticipant;
  }

  ngOnInit() {
    this.attachTracks();
  }

  ngOnChanges() {
    // Re-attach if participant reference updates
    this.attachTracks();
  }

  private attachTracks() {
    const videoEl = this.videoEl.nativeElement;

    // Detach any existing tracks first
    videoEl.srcObject = null;

    // Find camera track
    const cameraPub = this.participant.getTrackPublication(Track.Source.Camera);
    this.cameraEnabled = cameraPub?.isEnabled ?? false;

    if (cameraPub?.track) {
      cameraPub.track.attach(videoEl);
    }

    // Mic state
    const micPub = this.participant.getTrackPublication(Track.Source.Microphone);
    this.micEnabled = micPub?.isEnabled ?? false;
  }

  ngOnDestroy() {
    // Detach to stop media and free resources
    const cameraPub = this.participant.getTrackPublication(Track.Source.Camera);
    cameraPub?.track?.detach(this.videoEl.nativeElement);
  }
}