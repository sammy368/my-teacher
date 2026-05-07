import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { AuthService } from "../../shared/services/auth.service";

interface Transaction {
  image: string;
  action: string;
  date: string;
  amount: string;
  category: string;
  status: "Success" | "Pending" | "Failed";
}

@Component({
  selector: "app-my-subjects",
  imports: [
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: "./my-subjects.component.html",
  styleUrl: "./my-subjects.component.css",
})
export class MySubjectsComponent {
  currentPage = 1;
  itemsPerPage = 5;

  transactionData: Transaction[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getMySubjects() {
    this.http
      .get(
        `${environment.apiBaseUrl}/student/my-subjects/${this.authService.getUserData()?.id}`,
      )
      .subscribe({
        next: (response) => {
          // Assuming the response is an array of transactions
          this.transactionData = Array.isArray(response) ? response : [];
        },
      });
  }

  ngOnInit() {
    this.getMySubjects();
  }

  get totalPages(): number {
    return Math.ceil(this.transactionData.length / this.itemsPerPage);
  }

  get currentItems(): Transaction[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.transactionData.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  handleViewMore(item: Transaction) {
    // logic here
    console.log("View More:", item);
  }

  handleDelete(item: Transaction) {
    // logic here
    console.log("Delete:", item);
  }

  getBadgeColor(status: string): "success" | "warning" | "error" {
    if (status === "Success") return "success";
    if (status === "Pending") return "warning";
    return "error";
  }
}
