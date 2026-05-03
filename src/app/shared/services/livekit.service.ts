import { Injectable, NgZone } from '@angular/core';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  Participant,
  Track,
  RemoteTrackPublication,
  RemoteTrack,
  ConnectionState,
  createLocalVideoTrack,
  createLocalAudioTrack,
} from 'livekit-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiveKitService {
  room = new Room({
    adaptiveStream: true,   // auto-adjust quality based on bandwidth
    dynacast: true,         // save bandwidth when video not visible
  });

  // Reactive state — use these in templates with async pipe
  participants$ = new BehaviorSubject<Participant[]>([]);
  connectionState$ = new BehaviorSubject<ConnectionState>(ConnectionState.Disconnected);
  isCameraEnabled$ = new BehaviorSubject<boolean>(false);
  isMicEnabled$ = new BehaviorSubject<boolean>(false);

  constructor(private ngZone: NgZone) {
    this.registerRoomEvents();
  }

  // ─── Connection ─────────────────────────────────────────────────────────────

  async connect(wsUrl: string, token: string) {
    await this.room.connect(wsUrl, token);

    // Start audio playback — must be called after a user interaction
    await this.room.startAudio();

    this.updateParticipants();
  }

  async disconnect() {
    await this.room.disconnect();
    this.participants$.next([]);
  }

  // ─── Media Controls ──────────────────────────────────────────────────────────

  async enableCamera() {
    await this.room.localParticipant.setCameraEnabled(true);
    this.isCameraEnabled$.next(true);
  }

  async disableCamera() {
    await this.room.localParticipant.setCameraEnabled(false);
    this.isCameraEnabled$.next(false);
  }

  async toggleCamera() {
    const enabled = this.room.localParticipant.isCameraEnabled;
    await this.room.localParticipant.setCameraEnabled(!enabled);
    this.isCameraEnabled$.next(!enabled);
  }

  async toggleMic() {
    const enabled = this.room.localParticipant.isMicrophoneEnabled;
    await this.room.localParticipant.setMicrophoneEnabled(!enabled);
    this.isMicEnabled$.next(!enabled);
  }

  get localParticipant(): LocalParticipant {
    return this.room.localParticipant;
  }

  // ─── Room Events ─────────────────────────────────────────────────────────────

  private registerRoomEvents() {
    this.room
      .on(RoomEvent.Connected, () => {
        this.ngZone.run(() => {
          this.connectionState$.next(ConnectionState.Connected);
          this.updateParticipants();
        });
      })
      .on(RoomEvent.Disconnected, () => {
        this.ngZone.run(() => {
          this.connectionState$.next(ConnectionState.Disconnected);
          this.participants$.next([]);
        });
      })
      .on(RoomEvent.ParticipantConnected, () => {
        this.ngZone.run(() => this.updateParticipants());
      })
      .on(RoomEvent.ParticipantDisconnected, () => {
        this.ngZone.run(() => this.updateParticipants());
      })
      .on(RoomEvent.TrackSubscribed, () => {
        this.ngZone.run(() => this.updateParticipants());
      })
      .on(RoomEvent.TrackUnsubscribed, () => {
        this.ngZone.run(() => this.updateParticipants());
      })
      .on(RoomEvent.LocalTrackPublished, () => {
        this.ngZone.run(() => this.updateParticipants());
      })
      .on(RoomEvent.TrackMuted, () => {
        this.ngZone.run(() => this.updateParticipants());
      })
      .on(RoomEvent.TrackUnmuted, () => {
        this.ngZone.run(() => this.updateParticipants());
      });
  }

  private updateParticipants() {
    // Local + all remote participants
    const all: Participant[] = [
      this.room.localParticipant,
      ...Array.from(this.room.remoteParticipants.values()),
    ];
    this.participants$.next(all);
    this.isCameraEnabled$.next(this.room.localParticipant.isCameraEnabled);
    this.isMicEnabled$.next(this.room.localParticipant.isMicrophoneEnabled);
  }
}