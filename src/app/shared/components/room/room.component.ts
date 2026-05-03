import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionState, Participant } from 'livekit-client';
import { LiveKitService } from '../../services/livekit.service';
import { SessionService } from '../../services/session.service';
import { ParticipantTileComponent } from '../participant-tile/participant-tile.component';

@Component({
  standalone: true,
  selector: 'app-room',
  templateUrl: './room.component.html',
  imports: [
    CommonModule,
    ParticipantTileComponent
  ],
  styles: [`
    .room-wrapper   { display: flex; flex-direction: column; height: 100vh;
                      background: #0f0f1a; color: white; }
    .participants-grid { flex: 1; display: grid; gap: 8px; padding: 16px;
                         grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
    .controls-bar   { display: flex; justify-content: center; gap: 12px;
                      padding: 16px; background: #1a1a2e; }
    button          { padding: 10px 20px; border-radius: 8px; border: none;
                      cursor: pointer; font-size: 0.95rem; background: #3a3a5c; color: white; }
    button.off      { background: #8b0000; }
    .leave-btn      { background: #c0392b; }
    .status         { display: flex; align-items: center; justify-content: center;
                      flex: 1; font-size: 1.2rem; }
  `]
})
export class RoomComponent implements OnInit, OnDestroy {
  @Input() roomName!: string;
  @Input() userName!: string;
  @Input() role: 'teacher' | 'student' = 'student';

  constructor(
    public lk: LiveKitService,
    private session: SessionService
  ) {}

  async ngOnInit() {
    // 1. Get token from your NestJS backend
    if (!this.roomName) {
      throw new Error('Room name is required to join the session.');
    }

    const tokenResponse = await this.session.getLiveKitToken(
      this.roomName, this.role
    );
    if (!tokenResponse?.token || !tokenResponse?.wsUrl) {
      throw new Error('Invalid LiveKit token response.');
    }
    const { token, wsUrl } = tokenResponse;

    // 2. Connect to LiveKit Cloud
    await this.lk.connect(wsUrl, token);

    // 3. Auto-enable camera + mic on join
    await this.lk.enableCamera();
    await this.lk.toggleMic();
  }

  ngOnDestroy() {
    this.lk.disconnect();
  }

  leave() {
    this.lk.disconnect();
  }

  trackParticipant(_: number, p: Participant) {
    return p.identity;
  }
}