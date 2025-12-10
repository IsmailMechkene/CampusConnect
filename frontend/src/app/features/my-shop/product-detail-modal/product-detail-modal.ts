import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail-modal.html',
  styleUrls: ['./product-detail-modal.css']
})
export class ProductDetailModalComponent implements OnInit {
  
  /**
   * Product to display/edit
   */
  @Input() product!: Product;

  /**
   * Whether user can edit (seller mode)
   */
  @Input() canEdit = false;

  /**
   * Event emitted when modal is closed
   */
  @Output() close = new EventEmitter<void>();

  /**
   * Event emitted when product is saved
   */
  @Output() save = new EventEmitter<Product>();

  /**
   * Event emitted when product is deleted
   */
  @Output() delete = new EventEmitter<string>();

  /**
   * Edited product data
   */
  editedProduct!: Product;

  /**
   * Currently selected image index
   */
  selectedImageIndex = 0;

  /**
   * Edit mode flag
   */
  isEditMode = false;

  ngOnInit(): void {
    // Create a copy of the product for editing
    this.editedProduct = { ...this.product };
    
    // Initialize images array if not present
    if (!this.editedProduct.images || this.editedProduct.images.length === 0) {
      this.editedProduct.images = [this.editedProduct.image];
    }
  }

  /**
   * Get stars array for rating display
   */
  getStars(): number[] {
    return Array(Math.floor(this.product.rating)).fill(0);
  }

  /**
   * Select image to display
   */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  /**
   * Get current image URL
   */
  getCurrentImage(): string {
    return this.editedProduct.images?.[this.selectedImageIndex] || this.editedProduct.image;
  }

  /**
   * Enable edit mode
   */
  enableEditMode(): void {
    this.isEditMode = true;
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.isEditMode = false;
    this.editedProduct = { ...this.product };
  }

  /**
   * Save changes
   */
  saveChanges(): void {
    this.save.emit(this.editedProduct);
    this.isEditMode = false;
  }

  /**
   * Delete product
   */
  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.delete.emit(this.product.id);
    }
  }

  /**
   * Add new tag
   */
  addTag(tagInput: HTMLInputElement): void {
    const tag = tagInput.value.trim();
    if (tag && !this.editedProduct.tags?.includes(tag)) {
      this.editedProduct.tags = [...(this.editedProduct.tags || []), tag];
      tagInput.value = '';
    }
  }

  /**
   * Remove tag
   */
  removeTag(tag: string): void {
    this.editedProduct.tags = this.editedProduct.tags?.filter(t => t !== tag);
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.close.emit();
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }
}