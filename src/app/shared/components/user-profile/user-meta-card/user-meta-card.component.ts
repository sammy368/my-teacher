import { Component } from "@angular/core";
import { ModalService } from "../../../services/modal.service";
import { InputFieldComponent } from "./../../form/input/input-field.component";

import { AuthService, UserData } from "../../../services/auth.service";
import { ButtonComponent } from "../../ui/button/button.component";
import { ModalComponent } from "../../ui/modal/modal.component";

@Component({
  selector: "app-user-meta-card",
  imports: [ModalComponent, InputFieldComponent, ButtonComponent],
  templateUrl: "./user-meta-card.component.html",
  styles: ``,
})
export class UserMetaCardComponent {
  constructor(
    public modal: ModalService,
    private authService: AuthService,
  ) {}

  userData: UserData | null = null;
  user: any = null;

  isOpen = false;
  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }

  ngOnInit() {
    this.userData = this.authService.getUserData();
    this.user = {
      firstName: this.userData?.firstName,
      lastName: this.userData?.lastName,
      role: this.userData?.role,
      location: "Arizona, United States",
      avatar: "/images/user/owner.jpg",
      social: {
        facebook: "https://www.facebook.com/PimjoHQ",
        x: "https://x.com/PimjoHQ",
        linkedin: "https://www.linkedin.com/company/pimjo",
        instagram: "https://instagram.com/PimjoHQ",
      },
      email: this.userData?.email,
      phone: "+09 363 398 46",
      bio: "Team Manager",
    };
  }

  // Example user data (could be made dynamic)

  handleSave() {
    // Handle save logic here
    console.log("Saving changes...");
    this.modal.closeModal();
  }
}
