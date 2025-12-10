import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ShopService } from '../../../../services/shopService.service';

@Component({
  selector: 'app-create-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create-boutique-component.html',
  styleUrls: ['./create-boutique-component.css'],
})
export class CreateBoutiqueComponent implements OnInit {
  model: any = {
    brandName: '',
    bio: '', 
    description: '',
    keyword: '',
    email: '', 
    phone: '',
    tag1: '',
    tag2: '',
    tag3: '',
    tag4: '',
    social: {
      facebook: '',
      instagram: '',
      linkedin: '',
      x: '',
      tiktok: '',
    },
    payments: {
      cod: false,
      card: false,
      edinar: false,
    },
    categories: {} as Record<string, boolean>,
  };

  paymentOptions = [
    { id: 'cod', label: 'Cash on Delivery' },
    { id: 'card', label: 'Card' },
    { id: 'edinar', label: 'E-Dinar' },
  ];

  categories = [
    'Handmade',
    'Gift',
    'Elegant',
    'Wool',
    'Clothing',
    'Accessories',
    'Electronics',
    'Books',
    'Beauty',
    'Other',
  ];

  logoFile: File | null = null;
  bannerFile: File | null = null;
  logoPreview: string | ArrayBuffer | null = null;
  bannerPreview: string | ArrayBuffer | null = null;

  // UI state
  catLimitError = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isEditMode = false;
  existingShopId: string | null = null;

  constructor(private shopService: ShopService, private router: Router) {}

  ngOnInit() {
    this.checkExistingShop();
  }

  async checkExistingShop() {
    try {
      // D'abord, vérifiez si l'utilisateur a un shop
      const status = await this.shopService.hasShop().toPromise();

      if (status?.hasShop) {
        // Ensuite, récupérez les détails complets du shop
        const shop = await this.shopService.getMyShop().toPromise();

        if (shop) {
          this.isEditMode = true;
          this.existingShopId = shop.id;

          // Map backend fields to frontend model
          this.model = {
            brandName: shop.brandName || '',
            bio: shop.moto || '',
            description: shop.description || '',
            keyword: shop.keyword || '',
            email: shop.brandEmail || '',
            phone: shop.phoneNumber || '',
            tag1: shop.tag1 || '',
            tag2: shop.tag2 || '',
            tag3: shop.tag3 || '',
            tag4: shop.tag4 || '',
            social: {
              facebook: shop.facebook || '',
              instagram: shop.instagram || '',
              linkedin: shop.linkedin || '',
              x: shop.x || '',
              tiktok: shop.tiktok || '',
            },
            payments: {
              cod: false,
              card: false,
              edinar: false,
            },
            categories: {},
          };

          // Set categories from tags
          [shop.tag1, shop.tag2, shop.tag3, shop.tag4].forEach((tag) => {
            if (tag) {
              this.model.categories[tag] = true;
            }
          });

          // Load existing images
          if (shop.logo) {
            this.logoPreview = shop.logo.startsWith('http')
              ? shop.logo
              : `http://localhost:3000${shop.logo}`; // Note: 3000, pas 4200
          }
          if (shop.banner_image) {
            this.bannerPreview = shop.banner_image.startsWith('http')
              ? shop.banner_image
              : `http://localhost:3000${shop.banner_image}`;
          }
        }
      }
    } catch (error) {
      console.log('Aucun shop existant ou erreur:', error);
      this.isEditMode = false;
    }
  }

  onLogoChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.logoFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result);
    reader.readAsDataURL(this.logoFile);
  }

  onBannerChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.bannerFile = input.files[0];
    const reader = new FileReader();
    reader.onload = () => (this.bannerPreview = reader.result);
    reader.readAsDataURL(this.bannerFile);
  }

  togglePayment(id: string) {
    this.model.payments[id] = !this.model.payments[id];
  }

  toggleCategory(name: string) {
    // Get currently selected categories
    const currentlySelected = Object.keys(this.model.categories).filter(
      (key) => this.model.categories[key]
    );

    const isCurrentlySelected = !!this.model.categories[name];

    if (isCurrentlySelected) {
      // If already selected, deselect it
      this.model.categories[name] = false;
      // Also remove from tags if present
      this.removeTag(name);
    } else {
      // If not selected, check if we can add more
      if (currentlySelected.length >= 4) {
        this.catLimitError = true;
        setTimeout(() => (this.catLimitError = false), 3000);
        return;
      }

      // Add to categories
      this.model.categories[name] = true;

      // Add to first available tag slot
      if (!this.model.tag1) {
        this.model.tag1 = name;
      } else if (!this.model.tag2) {
        this.model.tag2 = name;
      } else if (!this.model.tag3) {
        this.model.tag3 = name;
      } else if (!this.model.tag4) {
        this.model.tag4 = name;
      }
    }
  }

  private removeTag(name: string) {
    if (this.model.tag1 === name) this.model.tag1 = '';
    if (this.model.tag2 === name) this.model.tag2 = '';
    if (this.model.tag3 === name) this.model.tag3 = '';
    if (this.model.tag4 === name) this.model.tag4 = '';
  }

  async submit(form: NgForm) {
    // Mark all fields as touched
    if (form.invalid) {
      form.control.markAllAsTouched();

      // Show specific error for required fields
      if (!this.model.brandName) {
        this.errorMessage = 'Brand name is required';
      } else if (!this.model.keyword) {
        this.errorMessage = 'Keyword is required';
      } else if (!this.model.phone) {
        this.errorMessage = 'Phone number is required';
      }

      return;
    }

    // Validate keyword - version améliorée
    const kw = (this.model.keyword || '').toString().trim();

    // Vérifiez que c'est un seul mot
    if (kw.includes(' ')) {
      this.errorMessage = 'Keyword must be a single word with no spaces.';
      return;
    }

    // Vérifiez la longueur
    if (kw.length > 12) {
      this.errorMessage = 'Keyword cannot exceed 12 characters.';
      return;
    }

    // Assurez-vous que keyword n'est pas vide après trim
    if (!kw) {
      this.errorMessage = 'Keyword is required.';
      return;
    }

    // Check if at least one category is selected
    const selectedCategories = Object.keys(this.model.categories).filter(
      (key) => this.model.categories[key]
    );

    if (selectedCategories.length === 0) {
      this.errorMessage = 'Please select at least one category.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      // Create FormData
      const formData = new FormData();

      // Add text fields with backend expected names
      formData.append('brandName', this.model.brandName);
      if (this.model.bio) formData.append('moto', this.model.bio);
      if (this.model.description) formData.append('description', this.model.description);
      formData.append('keyword', this.model.keyword);
      if (this.model.email) formData.append('brandEmail', this.model.email);
      formData.append('phoneNumber', this.model.phone);

      // Add tags
      if (this.model.tag1) formData.append('tag1', this.model.tag1);
      if (this.model.tag2) formData.append('tag2', this.model.tag2);
      if (this.model.tag3) formData.append('tag3', this.model.tag3);
      if (this.model.tag4) formData.append('tag4', this.model.tag4);

      // Add social media
      if (this.model.social.facebook) formData.append('facebook', this.model.social.facebook);
      if (this.model.social.instagram) formData.append('instagram', this.model.social.instagram);
      if (this.model.social.linkedin) formData.append('linkedin', this.model.social.linkedin);
      if (this.model.social.x) formData.append('x', this.model.social.x);
      if (this.model.social.tiktok) formData.append('tiktok', this.model.social.tiktok);

      // Add files
      if (this.logoFile) {
        formData.append('logo', this.logoFile);
      }
      if (this.bannerFile) {
        formData.append('banner', this.bannerFile);
      }

      let response;
      if (this.isEditMode && this.existingShopId) {
        // Edit mode
        response = await this.shopService.updateShop(this.existingShopId, formData).toPromise();
        this.successMessage = 'Shop updated successfully!';
      } else {
        // Create mode
        response = await this.shopService.createShopWithFiles(formData).toPromise();
        this.successMessage = 'Shop created successfully!';
      }

      console.log('Success:', response);

      // Show success message and redirect after delay
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);
    } catch (error: any) {
      console.error('Error:', error);
      this.errorMessage =
        error.error?.message || error.error?.error || 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  // Helper method to get selected categories for display
  getSelectedCategories(): string[] {
    return Object.keys(this.model.categories).filter((key) => this.model.categories[key]);
  }
}
