import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-feature-flag-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feature-flag-filters.html',
  styleUrl: './feature-flag-filters.css'
})
export class FeatureFlagFiltersComponent {

  @Input() searchTerm!: string;
  @Input() environment!: string;
  @Input() status!: string;
  @Input() environments!: string[];

  @Output() searchChange = new EventEmitter<string>();
  @Output() environmentChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<string>();

}
