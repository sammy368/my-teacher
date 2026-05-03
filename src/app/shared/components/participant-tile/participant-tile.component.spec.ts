import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantTileComponent } from './participant-tile.component';

describe('ParticipantTileComponent', () => {
  let component: ParticipantTileComponent;
  let fixture: ComponentFixture<ParticipantTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
