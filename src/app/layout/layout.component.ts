import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { Download } from "./download/download.component";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";

@Component({
  selector: "layout",
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, Download, NzCheckboxModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class Layout {
  isCollapsed = false;
}
