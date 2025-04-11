import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-main',
  imports: [FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  @ViewChild('textArea') textArea!: ElementRef<HTMLTextAreaElement>;

  inputText: string = '';
  selectionStart: number = 0;
  selectionEnd: number = 0;
  selectedText: string = '';

  synonyms: string[] = [];

  chars: number = 0;
  words: number = 0;

  loading: boolean = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.updateCounts();
  }

  updateCounts(): void {
    this.chars = this.inputText.length;
    this.words = this.inputText.trim() === '' ? 0 : this.inputText.trim().split(/\s+/).length;
  }

  reset(): void {
    this.loading = false;
    this.error = null;

    this.synonyms = [];
    this.selectedText = '';
    this.selectionStart = 0;
    this.selectionEnd = 0;
  }

  onTextChange(): void {
    this.updateCounts();
    this.reset();
  }

  copyTextToClipboard(): void {
    navigator.clipboard.writeText(this.inputText);
  }

  getSynonyms(): void {
    this.reset();
    
    const text = this.textArea.nativeElement;
    this.selectionStart = text.selectionStart;
    this.selectionEnd = text.selectionEnd;
    this.selectedText = this.inputText.substring(this.selectionStart, this.selectionEnd).trim();

    if (!this.selectedText) {
      alert('Please select a word or phrase');
      return;
    }

    this.loading = true;
    this.apiService.getSynonyms(this.selectedText)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.synonyms = res.map((item) => item.word);
          } else {
            this.error = `No synonyms found for "${this.selectedText}"`;
          }
        },
        error: (err) => {
          this.error = `Failed to fetch synonyms. Please try again later. (${err.message || 'Unknown error'})`;
        }
      });
  }

  replaceSelectedText(newText: string): void {
    if (this.selectionStart !== undefined && this.selectionEnd !== undefined) {
      this.inputText = `${this.inputText.substring(0, this.selectionStart)}${newText}${this.inputText.substring(this.selectionEnd)}`;

      this.reset();
      this.updateCounts();
    }
  }
}
