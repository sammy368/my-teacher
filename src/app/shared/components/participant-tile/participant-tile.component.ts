import {
  Component, Input, OnInit, OnDestroy,
  ViewChild, ElementRef
} from '@angular/core';
import {
  Participant, Track, LocalParticipant,
  RoomEvent, RemoteTrackPublication, RemoteParticipant
} from 'livekit-client';
import { CommonModule } from '@angular/common';
import { LiveKitService } from '../../../shared/services/livekit.service';

@Component({
  selector: 'app-participant-tile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative bg-gray-800 rounded-xl overflow-hidden"
         style="aspect-ratio: 16/9">

      <video #videoEl autoplay playsinline
        [muted]="isLocal"
        class="w-full h-full object-cover">
      </video>

      <div *ngIf="!cameraEnabled"
           class="absolute inset-0 flex items-center justify-center
                  bg-gray-700 text-white text-5xl">
        {{ participant?.identity?.[0]?.toUpperCase() }}
      </div>

      <div class="absolute bottom-2 left-2 bg-black/60 text-white
                  text-xs px-2 py-1 rounded-md flex items-center gap-1">
        <span>{{ participant?.identity }}</span>
        <span *ngIf="isLocal"> (You)</span>
        <span *ngIf="!micEnabled">🔇</span>
      </div>

    </div>
  `
})
export class ParticipantTileComponent implements OnInit, OnDestroy {
  @Input() participant!: Participant;
  @ViewChild('videoEl', { static: true }) videoEl!: ElementRef<HTMLVideoElement>;

  cameraEnabled = false;
  micEnabled = false;

  // Store handlers so we can remove them later
  private onTrackSubscribed = (track: any, pub: any, participant: RemoteParticipant) => {
    if (participant.identity === this.participant.identity) {
      this.attachTracks();
    }
  };

  private onTrackUnsubscribed = (track: any, pub: any, participant: RemoteParticipant) => {
    if (participant.identity === this.participant.identity) {
      this.attachTracks();
    }
  };

  private onLocalTrackPublished = (pub: any, participant: LocalParticipant) => {
    if (participant.identity === this.participant.identity) {
      this.attachTracks();
    }
  };

  private onTrackMuted = (pub: any, participant: Participant) => {
    if (participant.identity === this.participant.identity) {
      this.updateTrackStates();
    }
  };

  private onTrackUnmuted = (pub: any, participant: Participant) => {
    if (participant.identity === this.participant.identity) {
      this.updateTrackStates();
    }
  };

  get isLocal() {
    return this.participant instanceof LocalParticipant;
  }

  constructor(private lk: LiveKitService) {}

  ngOnInit() {
    this.attachTracks();
    this.registerEvents();
  }

  private registerEvents() {
    // Listen to room-level track events and re-attach
    // when the event is for THIS participant
    this.lk.room.on(RoomEvent.TrackSubscribed, this.onTrackSubscribed);

    this.lk.room.on(RoomEvent.TrackUnsubscribed, this.onTrackUnsubscribed);

    this.lk.room.on(RoomEvent.LocalTrackPublished, this.onLocalTrackPublished);

    this.lk.room.on(RoomEvent.TrackMuted, this.onTrackMuted);

    this.lk.room.on(RoomEvent.TrackUnmuted, this.onTrackUnmuted);
  }

  private attachTracks() {
    if (!this.participant || !this.videoEl) return;

    const videoEl = this.videoEl.nativeElement;

    // Camera
    const cameraPub = this.participant.getTrackPublication(Track.Source.Camera);
    this.cameraEnabled = cameraPub?.isEnabled ?? false;
    if (cameraPub?.track) {
      cameraPub.track.attach(videoEl);
    }

    // Mic state
    const micPub = this.participant.getTrackPublication(Track.Source.Microphone);
    this.micEnabled = micPub?.isEnabled ?? false;
  }

  private updateTrackStates() {
    const cameraPub = this.participant.getTrackPublication(Track.Source.Camera);
    this.cameraEnabled = cameraPub?.isEnabled ?? false;

    const micPub = this.participant.getTrackPublication(Track.Source.Microphone);
    this.micEnabled = micPub?.isEnabled ?? false;
  }

  ngOnDestroy() {
    // Remove all listeners added by this tile
    this.lk.room.off(RoomEvent.TrackSubscribed, this.onTrackSubscribed);
    this.lk.room.off(RoomEvent.TrackUnsubscribed, this.onTrackUnsubscribed);
    this.lk.room.off(RoomEvent.LocalTrackPublished, this.onLocalTrackPublished);
    this.lk.room.off(RoomEvent.TrackMuted, this.onTrackMuted);
    this.lk.room.off(RoomEvent.TrackUnmuted, this.onTrackUnmuted);

    // Detach video
    const cameraPub = this.participant?.getTrackPublication(Track.Source.Camera);
    cameraPub?.track?.detach(this.videoEl.nativeElement);
  }
}