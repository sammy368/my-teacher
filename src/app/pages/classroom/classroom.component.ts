import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LiveKitService } from '../../shared/services/livekit.service';
import { SessionService } from '../../shared/services/session.service';
import { RoomComponent } from '../../shared/components/room/room.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-classroom',
  templateUrl: './classroom.component.html',
  styleUrls: ['./classroom.component.css'],
  imports: [
    RoomComponent
  ]
})
export class ClassroomPage implements OnInit {
  roomName = '';
  isLoading = true;
  error = '';
  shareLink = '';
  linkCopied = false;


  constructor(
    private route: ActivatedRoute,
    public lk: LiveKitService,
    private session: SessionService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Get room name from route: /classroom/:roomName
    this.roomName = this.route.snapshot.paramMap.get('roomName') ?? '';
    const role = this.authService.getUserRole() ?? 'student';
    const userName = this.route.snapshot.queryParamMap.get('name') ?? 'Anonymous';

    // Build the share link for students
    const base = window.location.origin;
    this.shareLink = `${base}/dashboard/classroom/${this.roomName}?role=student`;

    try {
      if (!this.roomName) {
        throw new Error('Classroom room name is missing in the route.');
      }

      const tokenResponse = await this.session.getLiveKitToken(this.roomName, role.toLowerCase());
      if (!tokenResponse?.token || !tokenResponse?.wsUrl) {
        throw new Error('Invalid LiveKit token response.');
      }

      const { token, wsUrl } = tokenResponse;
      await this.lk.connect(wsUrl, token);
      await this.lk.enableCamera();
      await this.lk.toggleMic();
    } catch (e: any) {
      this.error = e.message ?? 'Failed to connect';
    } finally {
      this.isLoading = false;
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareLink);
    this.linkCopied = true;
    setTimeout(() => this.linkCopied = false, 2000);
  }

  ngOnDestroy() {
    this.lk.disconnect();
  }
}