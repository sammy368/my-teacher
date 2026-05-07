import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  LocalParticipant,
  Participant,
  RemoteParticipant,
  RoomEvent,
  Track
} from 'livekit-client';
import { LiveKitService } from '../../../shared/services/livekit.service';

@Component({
  selector: 'app-participant-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant-tile.component.html', 
})
export class ParticipantTileComponent implements OnInit, OnDestroy {
  @Input() participant!: Participant;
  @ViewChild('videoEl', { static: true }) videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioEl', { static: true }) audioEl!: ElementRef<HTMLAudioElement>;

  cameraEnabled = false;
  micEnabled = false;

  get isLocal() {
    return this.participant instanceof LocalParticipant;
  }

  constructor(private lk: LiveKitService) {}

  // ── Stored handlers ──────────────────────────────────────────────────────────

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

  get participantIdentity() {
    return Array.isArray(this.participant.identity) ? this.participant.identity[0]?.toUpperCase() : this.participant.identity;
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  ngOnInit() {
    this.attachTracks();
    this.registerEvents();
  }

  private registerEvents() {
    this.lk.room.on(RoomEvent.TrackSubscribed, this.onTrackSubscribed);
    this.lk.room.on(RoomEvent.TrackUnsubscribed, this.onTrackUnsubscribed);
    this.lk.room.on(RoomEvent.LocalTrackPublished, this.onLocalTrackPublished);
    this.lk.room.on(RoomEvent.TrackMuted, this.onTrackMuted);
    this.lk.room.on(RoomEvent.TrackUnmuted, this.onTrackUnmuted);
  }

  private attachTracks() {
    if (!this.participant || !this.videoEl) return;

    const videoEl = this.videoEl.nativeElement;
    const audioEl = this.audioEl.nativeElement;

    // ── Camera ───────────────────────────────────────────────────────────────
    const cameraPub = this.participant.getTrackPublication(Track.Source.Camera);
    this.cameraEnabled = cameraPub?.isEnabled ?? false;
    if (cameraPub?.track) {
      cameraPub.track.attach(videoEl);
    }

    // ── Microphone ───────────────────────────────────────────────────────────
    const micPub = this.participant.getTrackPublication(Track.Source.Microphone);
    this.micEnabled = micPub?.isEnabled ?? false;
    if (micPub?.track && !this.isLocal) {
      // Only attach audio for remote participants
      // attaching local audio causes echo
      micPub.track.attach(audioEl);
    }
  }

  private updateTrackStates() {
    const cameraPub = this.participant.getTrackPublication(Track.Source.Camera);
    this.cameraEnabled = cameraPub?.isEnabled ?? false;

    const micPub = this.participant.getTrackPublication(Track.Source.Microphone);
    this.micEnabled = micPub?.isEnabled ?? false;
  }

  ngOnDestroy() {
    this.lk.room.off(RoomEvent.TrackSubscribed, this.onTrackSubscribed);
    this.lk.room.off(RoomEvent.TrackUnsubscribed, this.onTrackUnsubscribed);
    this.lk.room.off(RoomEvent.LocalTrackPublished, this.onLocalTrackPublished);
    this.lk.room.off(RoomEvent.TrackMuted, this.onTrackMuted);
    this.lk.room.off(RoomEvent.TrackUnmuted, this.onTrackUnmuted);

    // Detach both video and audio
    const cameraPub = this.participant?.getTrackPublication(Track.Source.Camera);
    cameraPub?.track?.detach(this.videoEl.nativeElement);

    const micPub = this.participant?.getTrackPublication(Track.Source.Microphone);
    micPub?.track?.detach(this.audioEl.nativeElement);
  }
}