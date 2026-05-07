import { Component } from "@angular/core";
import { UserCountComponent } from "../user-count/user-count.component";

@Component({
  selector: "app-dashboard",
  imports: [UserCountComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {}
